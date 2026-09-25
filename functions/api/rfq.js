// Cloudflare Pages Function: /api/rfq
// Secure Government RFQ & Micro-Purchase Intake Handler
// Integrates with Odoo CRM (crm.lead, res.partner, mail.activity, ir.attachment), Telnyx Priority Email, and Telnyx Instant SMS

const DEFAULT_TELNYX_API_KEY = '';

const DEFAULT_EMAIL_RECIPIENTS = [
    { email: 'support@2059ventures.com', name: '20/59 Support' },
    { email: 'qruffin@2059ventures.com', name: 'Quincy Ruffin' },
    { email: 'info@2059ventures.com', name: '20/59 Info' },
    { email: 'andrea.marcus@2059ventures.com', name: 'Andrea Marcus' }
];

const DEFAULT_ALERT_PHONES = [
    '+12055348492' // Quincy Ruffin direct mobile for urgent RFQ dispatch
];

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
    });
}

// ── Anti-Bot & Spam Shield Validator for Government Solicitations ───────────────────
function isSpamSubmission(data, clientIp = 'Direct') {
    // 1. Multi-Honeypot check: automated crawlers fill hidden fields
    const honeypots = ['rfq_token_hp', 'business_website_hp', 'middle_name', 'form_honeypot'];
    for (const hp of honeypots) {
        if (data[hp] && String(data[hp]).trim().length > 0) {
            console.warn(`[RFQ Spam Shield] Honeypot triggered (${hp}) from IP: ${clientIp}`);
            return { isSpam: true, reason: 'honeypot_triggered' };
        }
    }

    // 2. Submission Timing Filter: human officers take at least 2.5 seconds
    if (data.form_loaded_at) {
        const elapsedMs = Date.now() - parseInt(data.form_loaded_at, 10);
        if (elapsedMs < 2500) {
            console.warn(`[RFQ Spam Shield] Bot rejected: filled form in ${elapsedMs}ms from IP: ${clientIp}`);
            return { isSpam: true, reason: 'submission_too_fast' };
        }
    }

    // 3. NANP Phone number validation for US public-sector inquiries
    const phoneRaw = String(data.phone || '').trim();
    if (phoneRaw) {
        const digits = phoneRaw.replace(/\D/g, '');
        const isStandard10 = digits.length === 10 && /^[2-9]\d{9}$/.test(digits);
        const isStandard11 = digits.length === 11 && /^1[2-9]\d{9}$/.test(digits);
        if (!isStandard10 && !isStandard11) {
            console.warn(`[RFQ Spam Shield] Invalid phone number (${phoneRaw}) from IP: ${clientIp}`);
            return { isSpam: true, reason: 'invalid_phone_format' };
        }
    }

    // 4. Phishing, crypto & SEO spam keyword pattern check
    const textToCheck = [
        data.line_items || '',
        data.special_instructions || '',
        data.agency || '',
        data.contact_name || ''
    ].join(' ').toLowerCase();

    const spamPatterns = [
        /\b(?:crypto|bitcoin|forex|casinos?|viagra|cialis|seo ranking|backlinks?|guest post|poker|porn)\b/i,
        /https?:\/\/[^\s]+\.(?:ru|xyz|top|work|click|cn|tk|buzz|biz|gq|cf|ml)\b/i
    ];

    for (const pattern of spamPatterns) {
        if (pattern.test(textToCheck)) {
            console.warn(`[RFQ Spam Shield] Phishing/Spam keyword rejected from IP: ${clientIp}`);
            return { isSpam: true, reason: 'blacklisted_pattern' };
        }
    }

    return { isSpam: false };
}

// ── Check if Submitter is a Verified Government Domain ────────────────────────────
function isVerifiedGovDomain(email) {
    if (!email) return false;
    const domain = email.trim().toLowerCase().split('@')[1] || '';
    return (
        domain.endsWith('.gov') ||
        domain.endsWith('.mil') ||
        domain.endsWith('.fed.us') ||
        domain.includes('.state.') ||
        domain.endsWith('.us') ||
        domain.includes('.va.gov')
    );
}

// ── Main Request Handler ──────────────────────────────────────────────────────────
export async function onRequestPost(context) {
    const { request, env, waitUntil } = context;
    const clientIp = request.headers.get('cf-connecting-ip') || 'Direct';

    try {
        const rawBody = await request.json();

        // 1. Run Anti-Bot & Spam Shield
        const spamCheck = isSpamSubmission(rawBody, clientIp);
        if (spamCheck.isSpam) {
            // Return deceptive 200 OK so spambots don't adjust attack strategies
            return new Response(JSON.stringify({
                success: true,
                message: 'Your RFQ solicitation has been received and routed to our procurement desk.',
                referenceNumber: 'RFQ-2059-PROCESSED'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
            });
        }

        const {
            agency = 'Public-Sector Agency',
            solicitation_number = 'Unassigned',
            procurement_type = 'Micro-Purchase / GPC',
            due_date = 'Standard',
            budget_range = 'Under $10,000 (Micro-Purchase)',
            contact_name = 'Contracting Officer',
            contact_title = 'Procurement Officer',
            email = '',
            phone = '',
            delivery_location = 'Not specified',
            categories = [],
            target_brands = [],
            line_items = '',
            special_instructions = '',
            set_aside_preference = [],
            compliance_needs = [],
            attachment_name = '',
            attachment_data = '', // Base64
            attachment_type = ''
        } = rawBody;

        if (!contact_name || !email) {
            return new Response(JSON.stringify({
                error: 'Contact Name and Official Email are required to register an RFQ.'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
            });
        }

        const isGovVerified = isVerifiedGovDomain(email);
        const timestamp = new Date().toISOString();
        const randomRef = Math.random().toString(36).substring(2, 8).toUpperCase();
        const rfqRefNumber = `RFQ-2059-${randomRef}`;

        // 2. Dispatch Priority Email Notification via Telnyx Email API
        const emailResult = await sendPriorityEmailAlert(env, {
            rfqRefNumber,
            agency,
            solicitation_number,
            procurement_type,
            due_date,
            budget_range,
            contact_name,
            contact_title,
            email,
            phone,
            delivery_location,
            categories,
            target_brands,
            line_items,
            special_instructions,
            set_aside_preference,
            compliance_needs,
            isGovVerified,
            clientIp,
            timestamp,
            attachment_name,
            attachment_data,
            attachment_type
        });

        // 2b. Dispatch Professional Auto-Reply Acknowledgment to Submitter / Officer
        const autoReplyPromise = sendSubmitterAutoReply(env, {
            rfqRefNumber,
            agency,
            solicitation_number,
            procurement_type,
            due_date,
            budget_range,
            contact_name,
            contact_title,
            email,
            phone,
            delivery_location,
            categories,
            target_brands,
            line_items,
            special_instructions,
            set_aside_preference,
            compliance_needs,
            attachment_name
        });
        if (typeof waitUntil === 'function') {
            waitUntil(autoReplyPromise);
        } else {
            autoReplyPromise.catch(e => console.warn('[Auto-Reply Dispatch Error]', e.message));
        }

        // 3. Dispatch Instant Mobile SMS Notification via Telnyx SMS API
        const smsText = `🚨 URGENT GOV RFQ: ${agency} ${solicitation_number !== 'Unassigned' ? '#' + solicitation_number : ''} from ${contact_name} (${contact_title}). Type: ${procurement_type}. Due: ${due_date}. Check Odoo CRM & Email immediately!`;
        
        const smsPromise = sendUrgentSmsAlert(env, smsText);
        if (typeof waitUntil === 'function') {
            waitUntil(smsPromise);
        } else {
            smsPromise.catch(e => console.warn('[SMS Dispatch Error]', e.message));
        }

        // 4. Synchronize into Odoo CRM (res.partner, crm.lead, mail.activity, ir.attachment)
        const odooPromise = syncToOdooCrm(env, {
            rfqRefNumber,
            agency,
            solicitation_number,
            procurement_type,
            due_date,
            budget_range,
            contact_name,
            contact_title,
            email,
            phone,
            delivery_location,
            categories,
            target_brands,
            line_items,
            special_instructions,
            set_aside_preference,
            compliance_needs,
            isGovVerified,
            clientIp,
            timestamp,
            attachment_name,
            attachment_data,
            attachment_type
        });

        if (typeof waitUntil === 'function') {
            waitUntil(odooPromise);
        } else {
            odooPromise.catch(e => console.warn('[Odoo RFQ Sync Error]', e.message));
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Your RFQ solicitation has been successfully received by 20 59 Ventures Corp. Our federal contracting desk will prioritize your quote.',
            referenceNumber: rfqRefNumber,
            isGovVerified,
            telnyxMessageId: emailResult.id || emailResult.data?.id
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });

    } catch (err) {
        console.error('[RFQ Function Exception]', err);
        return new Response(JSON.stringify({ error: err.message || 'An error occurred while processing the RFQ.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }
}

// ── Send Priority HTML Email Alert via Telnyx Email API ───────────────────────────
async function sendPriorityEmailAlert(env, data) {
    const apiKey = env.TELNYX_API_KEY || DEFAULT_TELNYX_API_KEY;
    if (!apiKey) return { success: false, reason: 'missing_telnyx_key' };

    const fromEmail = env.TELNYX_FROM_EMAIL || 'support@2059ventures.com';
    const fromName = '20/59 Ventures Federal Procurement Desk';

    const brandList = Array.isArray(data.target_brands) && data.target_brands.length > 0
        ? data.target_brands.join(', ')
        : 'Open / Multi-Vendor';

    const catList = Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories.join(', ')
        : 'General IT Hardware';

    const setAsideList = Array.isArray(data.set_aside_preference) && data.set_aside_preference.length > 0
        ? data.set_aside_preference.join(', ')
        : 'Open Commercial';

    const govBadge = data.isGovVerified
        ? '<span style="background: #16a34a; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">✓ VERIFIED .GOV / .MIL OFFICER</span>'
        : '<span style="background: #e2e8f0; color: #475569; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">Commercial / Public Domain</span>';

    const emailSubject = `🚨 [URGENT RFQ ${data.rfqRefNumber}] ${data.agency} - ${data.solicitation_number} (Due: ${data.due_date})`;

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #111827;">
      <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1b4730 0%, #256041 100%); padding: 24px 30px; color: #ffffff;">
          <div style="font-size: 12px; font-weight: 800; color: #fef08a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            Federal Contracting &amp; Micro-Purchase Dispatch
          </div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; line-height: 1.2;">
            New Government RFQ / SOW Inbound
          </h1>
          <div style="margin-top: 10px; font-size: 13px; opacity: 0.95;">
            Tracking Ref: <strong>${data.rfqRefNumber}</strong> &bull; CAGE: 22DH9 &bull; UEI: GVR2NTGR4HU3
          </div>
        </div>

        <!-- Verification Banner -->
        <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px 30px; display: flex; align-items: center; justify-content: space-between;">
          ${govBadge}
          <span style="font-size: 12px; color: #64748b;">Received: ${data.timestamp}</span>
        </div>

        <div style="padding: 24px 30px;">
          <!-- Quick Action Bar -->
          <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 6px; padding: 14px 18px; margin-bottom: 22px;">
            <div style="font-weight: 700; color: #065f46; font-size: 14px; margin-bottom: 4px;">
              ⚡ Action Required: Expedited Quote Preparation
            </div>
            <div style="font-size: 13px; color: #047857; line-height: 1.4;">
              Submitter requested response by: <strong>${data.due_date}</strong>. Fast-track with TD SYNNEX, StarTech.com, or Ergotron distributor pricing.
            </div>
            <div style="margin-top: 10px;">
              <a href="mailto:${data.email}?subject=RE:%20${encodeURIComponent(data.rfqRefNumber)}%20-%20Quote%20from%2020%2059%20Ventures%20Corp%20(CAGE:%2022DH9)" style="display: inline-block; background: #256041; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 5px; font-weight: 600; font-size: 13px;">
                Reply to Submitter (${data.contact_name})
              </a>
            </div>
          </div>

          <!-- Agency & Officer Credentials -->
          <h3 style="font-size: 14px; text-transform: uppercase; color: #1e4d35; border-bottom: 2px solid #256041; padding-bottom: 4px; margin-bottom: 12px;">
            1. Agency &amp; Submitter Credentials
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; width: 38%;">Agency / Facility:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #111827;">${data.agency}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Solicitation / Ref #:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #111827;">${data.solicitation_number}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Procurement Type:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #d97706;">${data.procurement_type}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Estimated Budget Tier:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #111827;">${data.budget_range}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Contracting Officer / Title:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #111827;">${data.contact_name} &bull; <span style="font-weight: 500; color: #4b5563;">${data.contact_title}</span></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Official Email:</td>
              <td style="padding: 6px 0; font-weight: 700;"><a href="mailto:${data.email}" style="color: #256041; text-decoration: underline;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Direct Phone:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #111827;"><a href="tel:${data.phone}" style="color: #111827; text-decoration: none;">${data.phone || 'None provided'}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Delivery Location / Base:</td>
              <td style="padding: 6px 0; color: #111827;">${data.delivery_location}</td>
            </tr>
          </table>

          <!-- Hardware & Requirements -->
          <h3 style="font-size: 14px; text-transform: uppercase; color: #1e4d35; border-bottom: 2px solid #256041; padding-bottom: 4px; margin-bottom: 12px;">
            2. Scope, Hardware &amp; Line Items
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; width: 38%;">Target Manufacturers:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #111827;">${brandList}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Product Categories:</td>
              <td style="padding: 6px 0; color: #111827;">${catList}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Set-Aside Preference:</td>
              <td style="padding: 6px 0; color: #111827;">${setAsideList}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Attached Document:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #256041;">${data.attachment_name ? data.attachment_name + ' (Attached to CRM & Chatter)' : 'No file uploaded'}</td>
            </tr>
          </table>

          <!-- Detailed Line Items Box -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Line Items / Specifications / SOW Excerpt:</div>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; line-height: 1.5; white-space: pre-wrap; color: #1f2937;">
${data.line_items || 'No line items typed. Check attached SOW or solicitation document.'}
            </div>
          </div>

          ${data.special_instructions ? `
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Special Clauses / Instructions:</div>
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; font-size: 12.5px; color: #92400e;">
              ${data.special_instructions}
            </div>
          </div>` : ''}

          <!-- Audit Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 14px; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between;">
            <span>IP: ${data.clientIp}</span>
            <span>20 59 Ventures Corp &bull; SAM.gov Registered</span>
          </div>

        </div>
      </div>
    </body>
    </html>
    `;

    const payload = {
        from: { email: fromEmail, name: fromName },
        to: DEFAULT_EMAIL_RECIPIENTS,
        subject: emailSubject,
        html: emailHtml
    };

    if (data.attachment_data && data.attachment_name) {
        payload.attachments = [{
            filename: data.attachment_name,
            content: data.attachment_data,
            type: data.attachment_type || 'application/octet-stream'
        }];
    }

    const res = await fetch('https://api.telnyx.com/v2/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errText = await res.text();
        console.warn('[Telnyx Email Error]', res.status, errText);
        return { success: false, status: res.status, error: errText };
    }

    return await res.json();
}

// ── Send Urgent Mobile SMS via Telnyx SMS API ────────────────────────────────────
async function sendUrgentSmsAlert(env, smsText) {
    const apiKey = env.TELNYX_API_KEY || DEFAULT_TELNYX_API_KEY;
    if (!apiKey) return;

    const fromNumber = env.TELNYX_FROM_NUMBER || '+18889192059';
    const profileId = env.TELNYX_MESSAGING_PROFILE_ID || '40019b37-3f98-4fd3-9476-2554b33f3b6f';

    for (const alertPhone of DEFAULT_ALERT_PHONES) {
        try {
            await fetch('https://api.telnyx.com/v2/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    from: fromNumber,
                    to: alertPhone,
                    text: smsText,
                    messaging_profile_id: profileId
                })
            });
        } catch (e) {
            console.warn(`[SMS Alert Error for ${alertPhone}]`, e.message);
        }
    }
}

// ── Sync to Odoo CRM (res.partner, crm.lead, mail.activity, ir.attachment) ───────
async function syncToOdooCrm(env, data) {
    let odooUrl = env.ODOO_URL || 'https://odoohub.iamalgo.com';
    if (odooUrl.includes('odoo.iamalgo.com') && !odooUrl.includes('odoohub')) odooUrl = 'https://odoohub.iamalgo.com';
    const odooDb = env.ODOO_DB || 'IAM_Main';
    const odooUser = env.ODOO_USER || 'Qruffin@iamalgo.com';
    const odooPass = env.ODOO_PASS || 'admin_master_password';
    const companyId = 4; // 20 59 Ventures Corp

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
        // 1. Authenticate with Odoo
        const authRes = await fetch(`${odooUrl}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 2059-GovCon-RFQ/1.0' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'common',
                    method: 'authenticate',
                    args: [odooDb, odooUser, odooPass, {}]
                },
                id: 1
            }),
            signal: controller.signal
        });

        if (!authRes.ok) return false;
        const authData = await authRes.json();
        const uid = authData?.result;
        if (!uid) return false;

        // 2. Search or Create Contact (res.partner) with government agency & title
        let partnerId = null;
        if (data.email) {
            const searchRes = await fetch(`${odooUrl}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 2059-GovCon-RFQ/1.0' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            odooDb, uid, odooPass,
                            'res.partner', 'search_read',
                            [[['email', '=', data.email.trim().toLowerCase()]]],
                            { fields: ['id', 'name', 'phone'], limit: 1 }
                        ]
                    },
                    id: 2
                }),
                signal: controller.signal
            });

            const searchData = await searchRes.json();
            if (searchData?.result && searchData.result.length > 0) {
                partnerId = searchData.result[0].id;
            }
        }

        if (!partnerId) {
            const partnerVals = {
                name: data.contact_name,
                function: data.contact_title,
                parent_id: false,
                company_name: data.agency,
                email: data.email.trim().toLowerCase(),
                phone: data.phone || false,
                comment: `Public-Sector Procurement Submitter (${data.agency}). First RFQ: ${data.rfqRefNumber}`,
                company_id: companyId
            };

            const createPartnerRes = await fetch(`${odooUrl}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 2059-GovCon-RFQ/1.0' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [odooDb, uid, odooPass, 'res.partner', 'create', [partnerVals]]
                    },
                    id: 3
                }),
                signal: controller.signal
            });

            const partnerData = await createPartnerRes.json();
            partnerId = partnerData?.result;
        }

        // 3. Estimate Expected Revenue based on budget tier
        let expectedRev = 5000;
        if (data.budget_range.includes('50,000')) expectedRev = 25000;
        else if (data.budget_range.includes('250,000')) expectedRev = 100000;
        else if (data.budget_range.includes('250k+')) expectedRev = 300000;

        // 4. Create CRM Lead (crm.lead)
        const leadDescription = `GOVERNMENT RFQ & PROCUREMENT SUBMISSION
Reference: ${data.rfqRefNumber}
Agency / Facility: ${data.agency}
Solicitation #: ${data.solicitation_number}
Procurement Type: ${data.procurement_type}
Response Due Date: ${data.due_date}
Budget Tier: ${data.budget_range}

SUBMITTER CREDENTIALS:
- Name: ${data.contact_name}
- Title: ${data.contact_title}
- Official Email: ${data.email} ${data.isGovVerified ? '(VERIFIED .GOV/.MIL DOMAIN)' : ''}
- Phone: ${data.phone || 'None provided'}
- Delivery Location: ${data.delivery_location}

REQUIREMENTS & HARDWARE:
- Target Manufacturers: ${(data.target_brands || []).join(', ') || 'TD SYNNEX, StarTech.com, Ergotron'}
- Product Categories: ${(data.categories || []).join(', ')}
- Socioeconomic Set-Aside: ${(data.set_aside_preference || []).join(', ')}
- Compliance Needs: ${(data.compliance_needs || []).join(', ')}

ITEMIZED SPECIFICATIONS / SOW:
${data.line_items || 'See attached file.'}

SPECIAL INSTRUCTIONS:
${data.special_instructions || 'None'}

AUDIT METADATA:
- Timestamp: ${data.timestamp}
- IP: ${data.clientIp}`;

        const leadVals = {
            name: `[GOV RFQ] ${data.agency} - ${data.solicitation_number} (${data.contact_name})`,
            partner_id: partnerId || false,
            contact_name: data.contact_name,
            partner_name: data.agency,
            title: data.contact_title,
            email_from: data.email,
            phone: data.phone || false,
            company_id: companyId,
            team_id: 8, // 20/59 GovCon & IT Solutions
            description: leadDescription,
            expected_revenue: expectedRev,
            priority: '3', // High / Urgent
            type: 'opportunity'
        };

        const createLeadRes = await fetch(`${odooUrl}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 2059-GovCon-RFQ/1.0' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [odooDb, uid, odooPass, 'crm.lead', 'create', [leadVals]]
                },
                id: 4
            }),
            signal: controller.signal
        });

        const leadData = await createLeadRes.json();
        const leadId = leadData?.result;

        // 5. Post to Lead Chatter and Upload Attachment
        if (leadId) {
            const chatterHtml = `
                <div style="font-family: sans-serif; font-size: 13px; line-height: 1.5;">
                    <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #1e4d35;">
                        🏛️ Government RFQ Intake (${data.rfqRefNumber})
                    </p>
                    <ul style="margin: 0 0 10px 0; padding-left: 20px;">
                        <li><strong>Agency:</strong> ${data.agency} (${data.solicitation_number})</li>
                        <li><strong>Submitter:</strong> ${data.contact_name} &bull; ${data.contact_title} (${data.email})</li>
                        <li><strong>Type &amp; Due Date:</strong> ${data.procurement_type} &bull; Due: ${data.due_date}</li>
                        <li><strong>Target Brands:</strong> ${(data.target_brands || []).join(', ') || 'TD SYNNEX, StarTech.com, Ergotron'}</li>
                        <li><strong>Set-Aside Preference:</strong> ${(data.set_aside_preference || []).join(', ')}</li>
                    </ul>
                    <p><strong>Itemized Requirements:</strong></p>
                    <pre style="background: #f8fafc; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 12px; white-space: pre-wrap;">${data.line_items || 'See attached documents.'}</pre>
                </div>
            `;

            // Post Chatter Message
            await fetch(`${odooUrl}/jsonrpc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 2059-GovCon-RFQ/1.0' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        service: 'object',
                        method: 'execute_kw',
                        args: [
                            odooDb, uid, odooPass,
                            'crm.lead', 'message_post',
                            [leadId],
                            {
                                body: chatterHtml,
                                message_type: 'comment',
                                subtype_xmlid: 'mail.mt_comment'
                            }
                        ]
                    },
                    id: 5
                }),
                signal: controller.signal
            }).catch(e => console.warn('[Odoo Lead Chatter Error]', e.message));

            // Upload Attachment to Odoo if available
            if (data.attachment_data && data.attachment_name) {
                try {
                    await fetch(`${odooUrl}/jsonrpc`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 2059-GovCon-RFQ/1.0' },
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            method: 'call',
                            params: {
                                service: 'object',
                                method: 'execute_kw',
                                args: [
                                    odooDb, uid, odooPass,
                                    'ir.attachment', 'create',
                                    [{
                                        name: data.attachment_name,
                                        datas: data.attachment_data,
                                        res_model: 'crm.lead',
                                        res_id: leadId,
                                        type: 'binary',
                                        mimetype: data.attachment_type || 'application/pdf'
                                    }]
                                ]
                            },
                            id: 6
                        }),
                        signal: controller.signal
                    });
                } catch (attErr) {
                    console.warn('[Odoo Attachment Error]', attErr.message);
                }
            }

            // 6. Automatically Schedule an Activity for Follow-Up & Proactive Outreach
            try {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const deadlineDate = tomorrow.toISOString().split('T')[0];

                await fetch(`${odooUrl}/jsonrpc`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 2059-GovCon-RFQ/1.0' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'call',
                        params: {
                            service: 'object',
                            method: 'execute_kw',
                            args: [
                                odooDb, uid, odooPass,
                                'mail.activity', 'create',
                                [{
                                    res_model_id: 104, // crm.lead standard model id
                                    res_model: 'crm.lead',
                                    res_id: leadId,
                                    summary: `Prepare Quote: ${data.agency} (${data.due_date})`,
                                    note: `Urgent RFQ from ${data.contact_name} (${data.contact_title}). Verify pricing with TD SYNNEX / StarTech / Ergotron and reply to ${data.email}.`,
                                    date_deadline: deadlineDate
                                }]
                            ]
                        },
                        id: 7
                    }),
                    signal: controller.signal
                });
            } catch (actErr) {
                console.warn('[Odoo Activity Schedule Error]', actErr.message);
            }
        }

        clearTimeout(timeoutId);
        return true;

    } catch (odooErr) {
        clearTimeout(timeoutId);
        console.warn('[Odoo RFQ Sync Exception]', odooErr.message);
        return false;
    }
}

// ── Send Professional Acknowledgment Auto-Reply to Submitter / Officer ─────────────
async function sendSubmitterAutoReply(env, data) {
    const apiKey = env.TELNYX_API_KEY || DEFAULT_TELNYX_API_KEY;
    if (!apiKey || !data.email) return;

    const fromEmail = env.TELNYX_FROM_EMAIL || 'support@2059ventures.com';
    const fromName = '20 59 Ventures Corp — Federal Contracting Desk';
    const replyTo = 'support@2059ventures.com';

    const brandList = Array.isArray(data.target_brands) && data.target_brands.length > 0
        ? data.target_brands.join(', ')
        : 'TD SYNNEX, StarTech.com, Ergotron & Tier-1 OEMs';

    const subject = `RFQ Receipt & Acknowledgment: ${data.solicitation_number !== 'Unassigned' && data.solicitation_number !== 'Micro-Purchase / Direct Quote' ? data.solicitation_number : 'Procurement Inquiry'} [Ref: ${data.rfqRefNumber}] — 20 59 Ventures Corp`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1b4730 0%, #256041 100%); padding: 26px 32px; color: #ffffff;">
          <div style="font-size: 11.5px; font-weight: 800; color: #fef08a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px;">
            Official Procurement Acknowledgment
          </div>
          <h1 style="margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -0.01em;">
            20 59 VENTURES CORP
          </h1>
          <div style="margin-top: 8px; font-size: 12.5px; opacity: 0.95; line-height: 1.4;">
            CAGE: <strong>22DH9</strong> &bull; UEI: <strong>GVR2NTGR4HU3</strong> &bull; VOSB &bull; EDWOSB &bull; WOSB &bull; GPC Accepted
          </div>
        </div>

        <div style="padding: 28px 32px;">
          <p style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 0;">
            Dear ${data.contact_name}${data.contact_title ? ' (' + data.contact_title + ')' : ''},
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Thank you for contacting <strong>20 59 Ventures Corp</strong>. This notice confirms that your solicitation and quote request for <strong>${data.agency}</strong> has been officially logged in our procurement system under Reference Number:
          </p>

          <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; background: #f0fdf4; border: 1.5px dashed #22c55e; border-radius: 6px; padding: 10px 24px; font-family: ui-monospace, monospace; font-size: 16px; font-weight: 800; color: #15803d; letter-spacing: 0.5px;">
              ${data.rfqRefNumber}
            </div>
          </div>

          <!-- Turnaround Commitment Box -->
          <div style="background: #f8fafc; border-left: 4px solid #256041; padding: 14px 18px; border-radius: 4px; margin-bottom: 22px;">
            <div style="font-size: 13.5px; font-weight: 700; color: #1b4730; margin-bottom: 6px;">
              Fulfillment &amp; Turnaround Standards:
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.5; color: #334155;">
              <li><strong>Micro-Purchases (&lt;$10,000 / GPC):</strong> Itemized pricing and payment links dispatched within <strong>2 to 4 business hours</strong>.</li>
              <li><strong>Simplified Acquisitions (FAR Part 13):</strong> Full formal proposals with TAA compliance certifications and socioeconomic representation packages delivered prior to your requested deadline of <strong>${data.due_date}</strong>.</li>
              <li><strong>Supply Chain Guarantee:</strong> Sourced exclusively through authorized North American wholesale distribution (including <strong>TD SYNNEX</strong>, <strong>StarTech.com</strong>, and <strong>Ergotron</strong>) with full commercial manufacturer warranties.</li>
            </ul>
          </div>

          <!-- Summary Table -->
          <h3 style="font-size: 13px; text-transform: uppercase; color: #1b4730; border-bottom: 1.5px solid #256041; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 0.5px;">
            Submission Summary for Contract Records
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 22px;">
            <tr>
              <td style="padding: 5px 0; color: #64748b; width: 38%;">Agency / Facility:</td>
              <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${data.agency}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Solicitation / Reference:</td>
              <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${data.solicitation_number}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Procurement Type:</td>
              <td style="padding: 5px 0; font-weight: 600; color: #d97706;">${data.procurement_type}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Response Needed By:</td>
              <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${data.due_date}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Target Ecosystem:</td>
              <td style="padding: 5px 0; font-weight: 600; color: #0f172a;">${brandList}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Uploaded Document:</td>
              <td style="padding: 5px 0; color: #15803d; font-weight: 600;">${data.attachment_name ? data.attachment_name : 'None attached'}</td>
            </tr>
          </table>

          <!-- Direct Escalation Contacts -->
          <div style="background: #f1f5f9; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px; font-size: 12.5px; line-height: 1.5; color: #334155;">
            <strong>Immediate Contracting Assistance:</strong><br>
            If you have an urgent fiscal deadline or require same-day purchase card processing, please reach our federal desk directly:
            <div style="margin-top: 8px;">
              &bull; <strong>Toll-Free Procurement Desk:</strong> 1-888-919-2059<br>
              &bull; <strong>Direct Contracting Line:</strong> 205-534-8492<br>
              &bull; <strong>Inbound Agency Fax (T.38):</strong> 1-888-885-2059<br>
              &bull; <strong>Direct Email:</strong> <a href="mailto:support@2059ventures.com" style="color: #256041; text-decoration: underline;">support@2059ventures.com</a>
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 10px;">
            <a href="https://2059ventures.com/it-capabilities.html" style="display: inline-block; background: #256041; color: #ffffff; text-decoration: none; padding: 9px 20px; border-radius: 6px; font-weight: 700; font-size: 13px;">
              View Official Capabilities Statement (PDF)
            </a>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px; margin-bottom: 0; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            Sincerely,<br>
            <strong>Federal Contracting &amp; Simplified Acquisitions Desk</strong><br>
            20 59 Ventures Corp &bull; 212 W Troy St, Dothan, AL 36303<br>
            SAM.gov CAGE: 22DH9 &bull; UEI: GVR2NTGR4HU3 &bull; Primary NAICS: 423430 &bull; 541519
          </p>

        </div>
      </div>
    </body>
    </html>
    `;

    try {
        await fetch('https://api.telnyx.com/v2/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                from: { email: fromEmail, name: fromName },
                to: [{ email: data.email, name: data.contact_name }],
                reply_to: replyTo,
                subject: subject,
                html: html
            })
        });
    } catch (e) {
        console.warn('[Submitter Auto-Reply Error]', e.message);
    }
}
