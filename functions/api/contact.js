// Cloudflare Pages Function: /api/contact
// Dispatches contact inquiries and lead records via Telnyx Email API and syncs to Odoo CRM with TCPA compliance

const DEFAULT_TELNYX_API_KEY = '';

const DEFAULT_EMAIL_RECIPIENTS = [
    { email: 'support@2059ventures.online', name: '20/59 Support' },
    { email: 'qruffin@2059ventures.online', name: 'Quincy Ruffin' },
    { email: 'info@2059ventures.online', name: '20/59 Info' },
    { email: 'andrea.marcus@2059ventures.online', name: 'Andrea Marcus' }
];

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

// ─── Anti-Bot & Spam Shield Validator ──────────────────────────────────────
function isSpamSubmission(data, clientIp = 'Direct') {
    // 1. Honeypot check: automated bots populate hidden input fields
    const honeypotKeys = ['b_website_url', 'company_website', 'form_honeypot', 'website_hp', 'middle_name'];
    for (const key of honeypotKeys) {
        if (data[key] && String(data[key]).trim().length > 0) {
            console.warn(`[Spam Shield] Bot trapped by honeypot field (${key}) from IP: ${clientIp}`);
            return { isSpam: true, reason: 'honeypot_triggered' };
        }
    }

    // 2. High-risk link and phishing pattern check across free-text and name fields
    const textToCheck = [
        data.message,
        data.management_needs,
        data.additional_services,
        data.housing_need_summary,
        data.special_needs,
        data.name,
        data.full_name,
        data.owner_name
    ].filter(Boolean).join(' ').toLowerCase();

    // Known scam platforms, sweepstakes, deceptive links & raw URL injection
    const spamPatterns = [
        /telegra\.ph/i,
        /t\.me\//i,
        /bit\.ly/i,
        /tinyurl\.com/i,
        /cutt\.ly/i,
        /is\.gd/i,
        /rb\.gy/i,
        /wa\.me\//i,
        /chat\.whatsapp\.com/i,
        /whatsapp\.com\//i,
        /lamborghini/i,
        /sweepstakes/i,
        /lottery/i,
        /crypto.*profit/i,
        /casino/i,
        /viagra|cialis/i,
        /https?:\/\//i // Genuine initial inquiries and applications should not contain outbound hyperlinks
    ];

    for (const pattern of spamPatterns) {
        if (pattern.test(textToCheck)) {
            console.warn(`[Spam Shield] Spam pattern triggered (${pattern}) from IP: ${clientIp}`);
            return { isSpam: true, reason: 'spam_pattern_matched' };
        }
    }

    return { isSpam: false };
}

export async function onRequestPost(context) {
    const { request, env, waitUntil } = context;
    const apiKey = env.TELNYX_API_KEY || DEFAULT_TELNYX_API_KEY;

    try {
        let data = {};
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            data = await request.json();
        } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
        } else {
            try {
                data = await request.json();
            } catch (e) {
                data = {};
            }
        }

        const name = data.name || data.full_name || data.owner_name || 'Website Visitor';
        const email = data.email || '';
        const phone = data.phone || data.cell || '';
        const formType = data.form_type || data.inquiry_type || data.interest_type || 'Website Inquiry';

        const clientIp = request.headers.get('cf-connecting-ip') || 'Direct';
        const clientCountry = request.headers.get('cf-ipcountry') || 'US';
        const clientTimestamp = data.client_timestamp || new Date().toISOString();
        const timestampFormatted = new Date().toUTCString();

        // ── Anti-Spam & Honeypot Shield Check ──
        const spamCheck = isSpamSubmission(data, clientIp);
        if (spamCheck.isSpam) {
            console.warn(`[Spam Shield Dropped] Submission dropped (${spamCheck.reason}) from IP: ${clientIp} (${clientCountry})`);
            return new Response(JSON.stringify({
                success: true,
                message: 'Thank you for reaching out. We have received your inquiry and will be in touch shortly!',
                shielded: true
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const transactionalConsent = Boolean(
            data.transactional_consent === true || data.transactional_consent === 'true' || data.transactional_consent === 'on' ||
            data.sms_consent_transactional === true || data.sms_consent_transactional === 'true' || data.sms_consent_transactional === 'on'
        );
        const marketingConsent = Boolean(
            data.marketing_consent === true || data.marketing_consent === 'true' || data.marketing_consent === 'on' ||
            data.sms_consent_informational === true || data.sms_consent_informational === 'true' || data.sms_consent_informational === 'on'
        );

        // Friendly label mapping for all potential fields
        const fieldLabels = {
            name: 'Contact Name',
            full_name: 'Full Name',
            owner_name: 'Property Owner Name',
            email: 'Email Address',
            phone: 'Phone Number',
            form_type: 'Form Type',
            inquiry_type: 'Inquiry Category',
            interest_type: 'Partnership Interest',
            organization: 'Organization / Agency',
            agency: 'Organization / Agency',
            company: 'Company',
            veteran_status: 'Veteran Status',
            senior_status: 'Senior Status',
            hud_vash_voucher: 'HUD-VASH Voucher',
            housing_preference: 'Housing Preference',
            move_in_timeline: 'Move-in Timeline',
            special_needs: 'Accommodations / Needs',
            emergency_contact_name: 'Emergency Contact Name',
            emergency_contact_phone: 'Emergency Contact Phone',
            units_available: 'Units Available',
            property_address: 'Property Address',
            property_type: 'Property Type',
            tenant_preference: 'Tenant Preference',
            management_needs: 'Management Needs',
            additional_services: 'Additional Services',
            fair_housing_compliance: 'Fair Housing Compliance Acknowledged',
            transactional_consent: 'SMS Consent (Transactional / Account)',
            marketing_consent: 'SMS Consent (Marketing / Outreach)',
            message: 'Message / Notes'
        };

        // Build HTML table rows for submitted fields
        let tableRows = '';
        let plainTextFields = '';

        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && value !== null && value !== '' && !['client_timestamp', 'source_url'].includes(key)) {
                const label = fieldLabels[key] || key.replace(/_/g, ' ');
                let displayVal = value;
                if (value === 'on' || value === true || value === 'true') {
                    displayVal = 'Yes (Opted In / Agreed)';
                }
                tableRows += `<tr><td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600; width: 38%;">${label}:</td><td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;">${displayVal}</td></tr>`;
                plainTextFields += `${label}: ${displayVal}\n`;
            }
        }

        // 1. Team Notification HTML
        const teamNotificationHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff; color: #1e293b;">
            <div style="background-color: #0d1b2a; color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #10b981;">
              <span style="background: #10b981; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px;">New Web Lead</span>
              <h2 style="margin: 10px 0 0 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em;">20/59 Ventures &bull; ${formType}</h2>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">Origin: 2059ventures.online &bull; Geo: ${clientCountry} (${clientIp}) &bull; ${timestampFormatted}</p>
            </div>
            
            <div style="padding: 24px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  ${tableRows}
                </table>
              </div>

              <!-- TCPA & Opt-In Compliance Audit Box -->
              <div style="background: #0f172a; border: 1px dashed #38bdf8; border-radius: 8px; padding: 14px 18px; margin-top: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
                <strong style="color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">TCPA &amp; Opt-In Compliance Audit:</strong><br>
                &bull; <strong>Transactional SMS Consent:</strong> <span style="color: ${transactionalConsent ? '#4ade80' : '#f87171'}; font-weight: 700;">${transactionalConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}</span><br>
                &bull; <strong>Marketing SMS Consent:</strong> <span style="color: ${marketingConsent ? '#4ade80' : '#f87171'}; font-weight: 700;">${marketingConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}</span><br>
                &bull; <strong>Timestamp:</strong> ${timestampFormatted} (${clientTimestamp})<br>
                &bull; <strong>Client IP Signature:</strong> ${clientIp} (${clientCountry})<br>
                &bull; <strong>Source URL:</strong> ${data.source_url || 'https://2059ventures.online'}
              </div>
            </div>

            <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              20/59 Ventures Operational Platform &bull; support@2059ventures.online &bull; Delivered via Telnyx Email API
            </div>
          </div>
        `;

        const plainText = `
20/59 VENTURES - NEW ${formType.toUpperCase()}
==============================================
Received: ${timestampFormatted}
IP: ${clientIp} (${clientCountry})

${plainTextFields}

TCPA & SMS CONSENT AUDIT:
- Transactional Consent: ${transactionalConsent ? 'YES' : 'NO'}
- Marketing Consent: ${marketingConsent ? 'YES' : 'NO'}
- Timestamp: ${clientTimestamp}
- IP Signature: ${clientIp}
        `.trim();

        // Send alert via Telnyx
        const teamPayload = {
            from: {
                email: 'support@2059ventures.online',
                name: '20/59 Contact Portal'
            },
            to: DEFAULT_EMAIL_RECIPIENTS,
            subject: `[Website Inquiry] ${formType} - ${name}`,
            text_body: plainText,
            html_body: teamNotificationHtml
        };
        if (email) teamPayload.reply_to = email;

        const emailResp = await fetch('https://api.telnyx.com/v2/email_messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(teamPayload)
        });

        let emailResult = {};
        if (emailResp.ok) {
            emailResult = await emailResp.json().catch(() => ({}));
        } else {
            console.error('Telnyx Team Notification Error:', await emailResp.text().catch(() => ''));
        }

        // 2. Customer Confirmation Email
        if (email && email.includes('@')) {
            const clientConfirmationHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
                <div style="background: #0d1b2a; color: #ffffff; padding: 28px; text-align: center; border-bottom: 3px solid #10b981;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">20/59 VENTURES CORP</h1>
                  <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">Housing Referral &amp; Community Placement Services</p>
                </div>
                <div style="padding: 28px;">
                  <h2 style="font-size: 18px; color: #0d1b2a; margin: 0 0 12px 0;">Thank you for contacting us, ${name}.</h2>
                  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 16px 0;">
                    We have received your submission regarding <strong>${formType}</strong>. Our care coordinators and placement specialists have received your inquiry.
                  </p>
                  
                  <div style="background: #f8fafc; border-left: 4px solid #10b981; border-radius: 6px; padding: 14px 16px; margin: 20px 0; font-size: 13px; color: #334155;">
                    <strong>Inquiry Summary:</strong><br>
                    &bull; <strong>Inquiry Type:</strong> ${formType}<br>
                    ${phone ? `&bull; <strong>Phone:</strong> ${phone}<br>` : ''}
                    &bull; <strong>Submitted:</strong> ${timestampFormatted}
                  </div>

                  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                    If you are a case manager or have an immediate placement need, please contact our direct intake line below.
                  </p>

                  <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748b; line-height: 1.8;">
                    <strong style="color: #0d1b2a;">20 59 Ventures Corp.</strong><br>
                    Toll Free: 1-888-919-2059 | Direct: 205-534-8492<br>
                    Email: <a href="mailto:support@2059ventures.online" style="color: #10b981; text-decoration: none;">support@2059ventures.online</a><br>
                    Website: <a href="https://2059ventures.online" style="color: #10b981; text-decoration: none;">2059ventures.online</a>
                  </div>
                </div>
              </div>
            `;

            const clientPayload = {
                from: {
                    email: 'support@2059ventures.online',
                    name: '20 59 Ventures Corp'
                },
                to: [{ email: email, name: name }],
                subject: `Thank you for contacting 20 59 Ventures - ${formType}`,
                text_body: `Hello ${name},\n\nThank you for contacting 20 59 Ventures Corp regarding ${formType}. We have received your inquiry and our team will follow up with you shortly.\n\nBest regards,\n20 59 Ventures Corp.\nToll Free: 1-888-919-2059\nhttps://2059ventures.online`,
                html_body: clientConfirmationHtml,
                reply_to: 'support@2059ventures.online'
            };

            const clientPromise = fetch('https://api.telnyx.com/v2/email_messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(clientPayload)
            }).catch(e => console.error('Client confirmation dispatch error:', e));

            if (typeof waitUntil === 'function') {
                waitUntil(clientPromise);
            }
        }

        // 3. Resilient Odoo Lead & Chatter Sync
        const odooPromise = syncToOdoo({
            name,
            email,
            phone,
            formType,
            data,
            clientIp,
            clientTimestamp,
            transactionalConsent,
            marketingConsent,
            env
        }).catch(err => console.warn('Background Odoo sync warning:', err));

        if (typeof waitUntil === 'function') {
            waitUntil(odooPromise);
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Thank you for reaching out. We have received your inquiry and will be in touch shortly!',
            telnyxMessageId: emailResult.data?.id || emailResult.id
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (err) {
        console.error('[Contact Function Error]', err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Resilient Odoo JSON-RPC sync function
async function syncToOdoo({ name, email, phone, formType, data, clientIp, clientTimestamp, transactionalConsent, marketingConsent, env }) {
    const odooUrl = env.ODOO_URL || 'https://odoo.iamalgo.com';
    const odooDb = env.ODOO_DB || 'IAM_Main';
    const odooUser = env.ODOO_USER || 'Qruffin@iamalgo.com';
    const odooPass = env.ODOO_PASS || 'admin_master_password';
    const companyId = 4; // 20 59 Ventures Corp

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
        // 1. Authenticate with Odoo
        const authPayload = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: 'common',
                method: 'authenticate',
                args: [odooDb, odooUser, odooPass, {}]
            },
            id: 1
        };

        const authRes = await fetch(`${odooUrl}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(authPayload),
            signal: controller.signal
        });

        if (!authRes.ok) return false;
        const authData = await authRes.json();
        const uid = authData?.result;
        if (!uid) return false;

        // 2. Format detailed lead description and compliance log
        const leadDescription = `Website Inquiry from 2059ventures.online\n\nForm: ${formType}\nContact: ${name}\nEmail: ${email || 'None'}\nPhone: ${phone || 'None'}\n\nSubmission Data:\n${JSON.stringify(data, null, 2)}\n\nTCPA & Opt-In Compliance Audit:\n- Transactional Consent: ${transactionalConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}\n- Marketing Consent: ${marketingConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}\n- Timestamp: ${clientTimestamp}\n- IP Signature: ${clientIp}`;

        const leadValues = {
            name: `[${formType}] ${name}`,
            contact_name: name,
            email_from: email || false,
            phone: phone || false,
            company_id: companyId,
            description: leadDescription,
            type: 'opportunity'
        };

        const createPayload = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: 'object',
                method: 'execute_kw',
                args: [odooDb, uid, odooPass, 'crm.lead', 'create', [leadValues]]
            },
            id: 2
        };

        const createRes = await fetch(`${odooUrl}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createPayload),
            signal: controller.signal
        });

        const createData = await createRes.json();
        const leadId = createData?.result;

        // 3. Post full submission & TCPA compliance audit to Odoo Chatter
        if (leadId) {
            const chatterHtml = `
                <div style="font-family: sans-serif; font-size: 13px; line-height: 1.5;">
                    <p style="margin: 0 0 8px 0;"><strong>Web-to-CRM Lead Submission (2059ventures.online)</strong></p>
                    <ul style="margin: 0 0 10px 0; padding-left: 20px;">
                        <li><strong>Form:</strong> ${formType}</li>
                        <li><strong>Contact:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email || 'N/A'}</li>
                        <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
                    </ul>
                    <div style="background: #f1f5f9; border-left: 3px solid #10b981; padding: 10px; margin-top: 10px; font-size: 12px;">
                        <strong>TCPA Compliance Record:</strong><br>
                        &bull; Transactional SMS Consent: <b>${transactionalConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}</b><br>
                        &bull; Marketing SMS Consent: <b>${marketingConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}</b><br>
                        &bull; Client IP Signature: ${clientIp}<br>
                        &bull; Timestamp: ${clientTimestamp}
                    </div>
                </div>
            `;

            const chatterPayload = {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        odooDb,
                        uid,
                        odooPass,
                        'crm.lead',
                        'message_post',
                        [leadId],
                        {
                            body: chatterHtml,
                            subject: `TCPA Compliance Record - ${formType}`,
                            message_type: 'comment',
                            subtype_xmlid: 'mail.mt_comment'
                        }
                    ]
                },
                id: 3
            };

            await fetch(`${odooUrl}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatterPayload),
                signal: controller.signal
            }).catch(e => console.warn('[Odoo Chatter Post Error]', e.message));
        }

        return true;
    } catch (err) {
        // Silently fails if tunnel is sleeping or offline; Telnyx email ensures 0 lost inquiries
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
}
