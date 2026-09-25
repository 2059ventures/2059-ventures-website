import { onRequestPost as handleRfqPost, onRequestOptions as handleRfqOptions } from './functions/api/rfq.js';
/**
 * _worker.js — Cloudflare Workers Assets Entry Point
 *
 * This file is the main Worker that runs alongside the static site assets.
 * It intercepts API requests and proxies everything else to the static asset handler.
 *
 * Routes handled:
 *   POST /api/chat             — Harry AI chat proxy (uses TELNYX_API_KEY secret)
 *   POST /api/lead             — Harry AI lead alerts (via Telnyx Email REST API)
 *   POST /api/contact          — Website Contact & Modal Forms (via Telnyx Email REST API)
 *   POST /api/public/intake    — Participant Intake Applications (via Telnyx Email REST API + Azure sync)
 *   POST /api/intake           — Alias for /api/public/intake
 *   POST /api/intake-upload    — Scanned Intake Document Uploads (via Telnyx Email REST API with Attachment)
 *   POST /api/linkedin-conversion — LinkedIn CAPI
 *   POST /api/linkedin-lead-webhook — LinkedIn Lead Gen Forms Webhook
 *   OPTIONS *                  — CORS preflight
 *   * (all others)             — Served as static assets (HTML, CSS, JS, images)
 */

const HARRY_ASSISTANT_ID = 'assistant-a13e9614-4795-4962-b7e2-abdcba418c12';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SECURITY_HEADERS = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

const DEFAULT_EMAIL_RECIPIENTS = [
    { email: 'support@2059ventures.com', name: '20/59 Support' },
    { email: 'qruffin@2059ventures.com', name: 'Quincy Ruffin' },
    { email: 'info@2059ventures.com', name: '20/59 Info' },
    { email: 'andrea.marcus@2059ventures.com', name: 'Andrea Marcus' }
];

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
                const hostname = url.hostname.toLowerCase();
        
                // ── 301 Canonical Redirect to 2059ventures.com (Option A) ─────────────
                if (hostname === '2059ventures.online' || hostname === 'www.2059ventures.online' || hostname === 'www.2059ventures.com') {
                    if (request.method !== 'GET' && request.method !== 'HEAD' && url.pathname.startsWith('/api/')) {
                        // Allow API POST/PUT to proceed without dropping payload
                    } else {
                        const destination = 'https://2059ventures.com' + url.pathname + url.search;
                        return Response.redirect(destination, 301);
                    }
                }

        // ── Handle CORS preflight ──────────────────────────────────────────
        if (request.method === 'OPTIONS') {
            const apiRoutes = [
                '/api/chat', '/api/lead', '/api/contact',
                '/api/intake-upload', '/api/public/intake', '/api/intake',
                '/api/linkedin-conversion', '/api/linkedin-lead-webhook',
                '/api/telnyx/webhook', '/api/sms', '/api/rfq'
            ];
            if (apiRoutes.includes(url.pathname)) {
                return new Response(null, { status: 204, headers: CORS_HEADERS });
            }
        }

        const clientIp = request.headers.get('cf-connecting-ip') || 'Direct';
        const clientCountry = (request.headers.get('cf-ipcountry') || 'US').toUpperCase();

        // ── Edge IP / Subnet Blacklist ─────────────────────────────────────
        const BLOCKED_IPS = ['80.94.95.202'];
        const BLOCKED_SUBNETS = ['80.94.95.'];
        if (BLOCKED_IPS.includes(clientIp) || BLOCKED_SUBNETS.some(sub => clientIp.startsWith(sub))) {
            console.warn(`[Edge IP Block] Dropped request from blacklisted IP: ${clientIp} (${clientCountry})`);
            return new Response('Access Denied', { status: 403, headers: { 'Content-Type': 'text/plain' } });
        }

        // ── Edge Geo-Fence for Lead & Intake Submission Endpoints ───────────
        const INTAKE_PATHS = ['/api/contact', '/api/public/intake', '/api/intake', '/api/lead', '/api/intake-upload', '/api/rfq'];
        const ALLOWED_COUNTRIES = ['US', 'CA', 'PR', 'VI', 'GU', 'MP', 'AS'];
        if (request.method === 'POST' && INTAKE_PATHS.includes(url.pathname)) {
            if (!ALLOWED_COUNTRIES.includes(clientCountry)) {
                console.warn(`[Edge Geo-Fence] Blocked non-US lead submission from ${clientCountry} (IP: ${clientIp}) on ${url.pathname}`);
                return jsonResponse({
                    success: true,
                    message: 'Thank you for reaching out. We have received your inquiry and will be in touch shortly!',
                    shielded: true
                }, 200);
            }
        }

        // ── Handle Harry AI Chat Proxy ─────────────────────────────────────
        if (request.method === 'POST' && url.pathname === '/api/chat') {
            return handleHarryChat(request, env);
        }

        // ── Handle Harry Lead Email Alert (via Telnyx Email API) ───────────
        if (request.method === 'POST' && url.pathname === '/api/lead') {
            return handleHarryLead(request, env, ctx);
        }

        // ── Handle Website Contact & Modal Forms (via Telnyx Email API) ────
        if (request.method === 'POST' && url.pathname === '/api/contact') {
            return handleContactForm(request, env, ctx);
        }

        // ── Handle Online Participant Intake Form (via Telnyx Email API) ───
        if (request.method === 'POST' && (url.pathname === '/api/public/intake' || url.pathname === '/api/intake')) {
            return handlePublicIntake(request, env, ctx);
        }

        // ── Handle Scanned Intake Document Upload ──────────────────────────
        if (request.method === 'POST' && url.pathname === '/api/intake-upload') {
            return handleIntakeUpload(request, env, ctx);
        }

        // ── Handle LinkedIn Conversions API ────────────────────────────────
        if (request.method === 'POST' && url.pathname === '/api/linkedin-conversion') {
            return handleLinkedInConversion(request, env);
        }

        // ── Handle LinkedIn Lead Webhook ───────────────────────────────────
        if (url.pathname === '/api/linkedin-lead-webhook') {
            return handleLinkedInLeadWebhook(request, env);
        }

        // ── Handle Telnyx Inbound Webhook (SMS/MMS) ───────────────────────────
        if (request.method === 'POST' && url.pathname === '/api/telnyx/webhook') {
            return handleTelnyxWebhook(request, env);
        }

        // ── Handle Outbound SMS/MMS API Dispatch ──────────────────────────────
        if (request.method === 'POST' && url.pathname === '/api/sms') {
            return handleSmsDispatch(request, env);
        }

        // ── Handle Government RFQ & Micro-Purchase Submission (via Odoo CRM, Telnyx Email, SMS) ──
        if (url.pathname === '/api/rfq') {
            if (request.method === 'OPTIONS') {
                return handleRfqOptions();
            }
            if (request.method === 'POST') {
                return handleRfqPost({ request, env, waitUntil: (p) => ctx.waitUntil(p) });
            }
        }

        // ── Serve static assets (with security headers & cache-busting) ────
        const assetResponse = await env.ASSETS.fetch(request);
        const path = url.pathname.toLowerCase();
        const newHeaders = new Headers(assetResponse.headers);

        // Apply strict security headers
        for (const [headerKey, headerVal] of Object.entries(SECURITY_HEADERS)) {
            newHeaders.set(headerKey, headerVal);
        }

        if (path === '/' || path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js') || path.includes('harry-widget')) {
            newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            newHeaders.set('Pragma', 'no-cache');
            newHeaders.set('Expires', '0');
        }

        return new Response(assetResponse.body, {
            status: assetResponse.status,
            statusText: assetResponse.statusText,
            headers: newHeaders
        });
    }
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...CORS_HEADERS, ...SECURITY_HEADERS, 'Content-Type': 'application/json' }
    });
}

// ── Shared Telnyx Email API Dispatcher ──────────────────────────────────────
async function sendTelnyxEmail(env, { to, subject, text, html, attachments, replyTo, fromName = '20/59 Ventures' }) {
    const apiKey = env.TELNYX_API_KEY;
    if (!apiKey) {
        console.error('[Telnyx Email] TELNYX_API_KEY not configured in Worker environment.');
        return { success: false, error: 'TELNYX_API_KEY not configured' };
    }

    let recipients = [];
    if (Array.isArray(to) && to.length > 0) {
        recipients = to.map(r => typeof r === 'string' ? { email: r, name: r } : { email: r.email, name: r.name || r.email });
    } else if (typeof to === 'string' && to) {
        recipients = [{ email: to, name: to }];
    } else {
        recipients = DEFAULT_EMAIL_RECIPIENTS;
    }

    const payload = {
        from: {
            email: 'support@2059ventures.com',
            name: fromName
        },
        to: recipients,
        subject: subject,
        text_body: text || '',
        html_body: html || text || ''
    };

    if (replyTo) {
        payload.reply_to = replyTo;
    }

    if (Array.isArray(attachments) && attachments.length > 0) {
        payload.attachments = attachments.map(att => ({
            filename: att.filename || att.name || 'attachment',
            content_type: att.content_type || att.type || 'application/octet-stream',
            content: att.content || att.base64 || ''
        }));
    }

    try {
        const res = await fetch('https://api.telnyx.com/v2/email_messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok || res.status === 202) {
            const data = await res.json();
            const messageId = data?.data?.id || 'queued';
            console.log(`[Telnyx Email] Successfully dispatched message ID ${messageId} to ${recipients.map(r => r.email).join(', ')}`);
            return { success: true, messageId, data };
        } else {
            const errText = await res.text();
            console.error(`[Telnyx Email Error] Status ${res.status}: ${errText}`);
            return { success: false, error: errText, status: res.status };
        }
    } catch (err) {
        console.error('[Telnyx Email Exception]', err);
        return { success: false, error: err.message };
    }
}

// ── Handle Harry AI Chat Proxy ──────────────────────────────────────────────
async function handleHarryChat(request, env) {
    try {
        const body = await request.json();
        const { content, conversationId, assistantId } = body;

        const targetAssistantId = assistantId || HARRY_ASSISTANT_ID;
        const apiKey = env.TELNYX_API_KEY;

        if (!content) {
            return jsonResponse({ error: 'Content is required' }, 400);
        }

        if (!apiKey) {
            console.error('[Harry] TELNYX_API_KEY not set in Worker environment');
            return jsonResponse({
                content: "I'm temporarily unavailable. Please call our team at (888) 919-2059.",
                error: 'API key not configured'
            }, 200);
        }

        let activeConvId = (!conversationId || conversationId === 'new') ? null : conversationId;

        // Step 1: Create conversation if we don't have one
        if (!activeConvId) {
            const convRes = await fetch('https://api.telnyx.com/v2/ai/conversations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: `Harry Web Chat - ${new Date().toISOString()}` })
            });

            if (convRes.ok) {
                const convData = await convRes.json();
                activeConvId = convData.data?.id || convData.id;
                console.log('[Harry] Created conversation:', activeConvId);
            } else {
                console.error('[Harry] Failed to create conversation:', convRes.status);
                return jsonResponse({
                    content: "I couldn't start a conversation. Please try again or call (888) 919-2059."
                }, 200);
            }
        }

        // Step 2: Chat with Harry
        let chatRes = await fetch(
            `https://api.telnyx.com/v2/ai/assistants/${targetAssistantId}/chat`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content,
                    conversation_id: activeConvId,
                    name: 'Web Visitor'
                })
            }
        );

        // Step 3: Retry with fresh conversation if 404
        if (!chatRes.ok && chatRes.status === 404) {
            console.log('[Harry] Conversation expired (404), creating fresh one...');
            const newConvRes = await fetch('https://api.telnyx.com/v2/ai/conversations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: `Harry Web Chat - ${new Date().toISOString()}` })
            });

            if (newConvRes.ok) {
                const newConvData = await newConvRes.json();
                activeConvId = newConvData.data?.id || newConvData.id;

                chatRes = await fetch(
                    `https://api.telnyx.com/v2/ai/assistants/${targetAssistantId}/chat`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            content: content,
                            conversation_id: activeConvId,
                            name: 'Web Visitor'
                        })
                    }
                );
            }
        }

        if (!chatRes.ok) {
            const errText = await chatRes.text();
            console.error('[Harry] Telnyx error:', chatRes.status, errText);
            return jsonResponse({
                content: `I'm having a brief issue (${chatRes.status}). Please call (888) 919-2059 or use the Lead Form.`
            }, 200);
        }

        const chatData = await chatRes.json();
        const replyText = chatData.data?.content || chatData.content || 'Thank you for reaching out!';

        console.log(`[Harry] Reply for conv ${activeConvId}: ${replyText.substring(0, 80)}...`);

        return jsonResponse({
            content: replyText,
            conversationId: activeConvId,
            success: true
        }, 200);

    } catch (err) {
        console.error('[Harry] Worker error:', err);
        return jsonResponse({
            content: 'An error occurred. Please try again or reach out via the Lead Form.'
        }, 200);
    }
}

// ── Handle Harry Lead Email Alert (via Telnyx Email API) ────────────────────
async function handleHarryLead(request, env, ctx) {
    try {
        const body = await request.json();
        const { name, phone, email, leadType, inquiry, transcript, timestamp } = body;

        const leadCategory = leadType || 'General Housing Inquiry';
        const leadTime = timestamp || new Date().toLocaleString();

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #1e3a8a; color: #ffffff; padding: 24px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">20/59 Ventures • New Lead Alert</h2>
              <p style="margin: 6px 0 0 0; color: #93c5fd; font-size: 14px;">Captured by Harry AI Assistant</p>
            </div>
            <div style="padding: 24px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; margin-bottom: 12px;">
                  ${leadCategory}
                </span>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Applicant:</td><td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${name}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Phone:</td><td style="padding: 6px 0; color: #0f172a;">${phone || 'N/A'}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Email:</td><td style="padding: 6px 0; color: #0f172a;">${email || 'N/A'}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Details:</td><td style="padding: 6px 0; color: #0f172a;">${inquiry || 'Housing / Placement Inquiry'}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Timestamp:</td><td style="padding: 6px 0; color: #64748b;">${leadTime}</td></tr>
                </table>
              </div>
              ${transcript ? `
                <div>
                  <h4 style="margin: 0 0 10px 0; color: #1e293b;">Session Transcript:</h4>
                  <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 14px; border-radius: 4px; font-size: 13px; color: #334155; white-space: pre-wrap;">${transcript}</div>
                </div>
              ` : ''}
            </div>
            <div style="background-color: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b;">
              20/59 Ventures Housing Program &bull; support@2059ventures.com
            </div>
          </div>
        `;

        const plainText = `
20/59 VENTURES - NEW LEAD ALERT (HARRY AI)
=========================================
Category: ${leadCategory}
Applicant: ${name}
Phone: ${phone || 'N/A'}
Email: ${email || 'N/A'}
Details: ${inquiry || 'Housing / Placement Inquiry'}
Timestamp: ${leadTime}

${transcript ? `Transcript:
${transcript}` : ''}
        `.trim();

        const emailResult = await sendTelnyxEmail(env, {
            subject: `[Harry AI Lead] ${leadCategory} - ${name}`,
            text: plainText,
            html: htmlContent,
            replyTo: email || undefined,
            fromName: 'Harry AI Lead Assistant'
        });

        // Trigger LinkedIn Conversions API Event (Async/Background)
        if (ctx && typeof ctx.waitUntil === 'function') {
            ctx.waitUntil(sendLinkedInConversionEvent({
                email: email,
                phone: phone,
                name: name,
                eventName: leadCategory || 'Lead',
                conversionValue: '0.00'
            }, env));
        }

        return jsonResponse({
            success: true,
            message: 'Lead email alert dispatched successfully via Telnyx',
            telnyxMessageId: emailResult.messageId
        }, 200);

    } catch (err) {
        console.error('[Harry Lead] Worker error:', err);
        return jsonResponse({ error: err.message }, 500);
    }
}

// ─── Handle Website Contact & Modal Forms (via Telnyx Email API + Odoo CRM) ────────
// ─── Anti-Bot & Spam Shield Validator ──────────────────────────────────────
function isSpamSubmission(data, clientIp = 'Direct', clientCountry = 'US') {
    // 1. Honeypot check: automated bots populate hidden input fields
    const honeypotKeys = ['b_website_url', 'company_website', 'form_honeypot', 'website_hp', 'middle_name'];
    for (const key of honeypotKeys) {
        if (data[key] && String(data[key]).trim().length > 0) {
            console.warn(`[Spam Shield] Bot trapped by honeypot field (${key}) from IP: ${clientIp}`);
            return { isSpam: true, reason: 'honeypot_triggered' };
        }
    }

    // 2. Phone number validation (NANP standard for US/Canada)
    const phoneRaw = String(data.phone || data.cell || data.emergency_contact_phone || data.referralContact || '').trim();
    if (phoneRaw) {
        const digits = phoneRaw.replace(/\D/g, '');
        // Must be 10 digits (starting with 2-9) or 11 digits starting with 1 (followed by 2-9)
        const isStandard10 = digits.length === 10 && /^[2-9]\d{9}$/.test(digits);
        const isStandard11 = digits.length === 11 && /^1[2-9]\d{9}$/.test(digits);
        if (!isStandard10 && !isStandard11) {
            console.warn(`[Spam Shield] Invalid non-US phone format rejected (${phoneRaw}) from IP: ${clientIp}`);
            return { isSpam: true, reason: 'invalid_phone_format' };
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
        /ciao.*prezzo/i,
        /volevo sapere/i,
        /il tuo prezzo/i,
        /[\u0400-\u04FF]/,
        /[\u4e00-\u9fa5]/,
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

async function handleContactForm(request, env, ctx) {
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
        const spamCheck = isSpamSubmission(data, clientIp, clientCountry);
        if (spamCheck.isSpam) {
            console.warn(`[Spam Shield Dropped] Submission dropped (${spamCheck.reason}) from IP: ${clientIp} (${clientCountry})`);
            // Return fake 200 OK so bots believe the form succeeded and do not adapt
            return jsonResponse({
                success: true,
                message: 'Thank you for reaching out. We have received your inquiry and will be in touch shortly!',
                shielded: true
            }, 200);
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
            sms_consent_transactional: 'SMS Consent (Transactional/Reminders)',
            sms_consent_informational: 'SMS Consent (Informational/Outreach)',
            message: 'Message / Notes'
        };

        // Build HTML table rows for all submitted fields
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
                plainTextFields += `${label}: ${displayVal}
`;
            }
        }

        const htmlContent = `
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
              20/59 Ventures Operational Platform &bull; support@2059ventures.com &bull; Delivered via Telnyx Email API
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

        // 1. Send Team Alert Email via Telnyx
        const emailResult = await sendTelnyxEmail(env, {
            subject: `[Website Inquiry] ${formType} - ${name}`,
            text: plainText,
            html: htmlContent,
            replyTo: email || undefined,
            fromName: '20/59 Contact Portal'
        });

        // 2. Send Customer Confirmation Email (Auto-Receipt)
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
                    Email: <a href="mailto:support@2059ventures.com" style="color: #10b981; text-decoration: none;">support@2059ventures.com</a><br>
                    Website: <a href="https://2059ventures.online" style="color: #10b981; text-decoration: none;">2059ventures.online</a>
                  </div>
                </div>
              </div>
            `;

            const confirmationPromise = sendTelnyxEmail(env, {
                to: [{ email: email, name: name }],
                subject: `Thank you for contacting 20 59 Ventures - ${formType}`,
                text: `Hello ${name},\n\nThank you for contacting 20 59 Ventures Corp regarding ${formType}. We have received your inquiry and our team will follow up with you shortly.\n\nBest regards,\n20 59 Ventures Corp.\nToll Free: 1-888-919-2059\nhttps://2059ventures.online`,
                html: clientConfirmationHtml,
                replyTo: 'support@2059ventures.com',
                fromName: '20 59 Ventures Corp'
            });

            if (ctx && typeof ctx.waitUntil === 'function') {
                ctx.waitUntil(confirmationPromise);
            }
        }

        // 3. Resilient Odoo Lead & Chatter Compliance Sync
        if (ctx && typeof ctx.waitUntil === 'function') {
            ctx.waitUntil(syncToOdoo({
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
            }));
        } else {
            syncToOdoo({
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
            }).catch(e => console.warn('[Odoo Background Sync Warning]', e));
        }

        // 4. LinkedIn Conversion Tracking
        if (ctx && typeof ctx.waitUntil === 'function') {
            ctx.waitUntil(sendLinkedInConversionEvent({
                email, phone, name,
                eventName: formType || 'Lead',
                conversionValue: '0.00'
            }, env));
        }

        return jsonResponse({
            success: true,
            message: 'Thank you for reaching out. We have received your inquiry and will be in touch shortly!',
            telnyxMessageId: emailResult.messageId
        }, 200);

    } catch (err) {
        console.error('[Contact Form Error]', err);
        return jsonResponse({ error: err.message }, 500);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Resilient Odoo 18 JSON-RPC & Chatter Synchronization Suite
// Company ID: 4 (20 59 Ventures Corp) | Team ID: 1
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Executes an arbitrary method on an Odoo model via JSON-RPC with timeout protection
 */
async function callOdooRpc(env, service, method, args, timeoutMs = 5000) {
    const odooUrl = env.ODOO_URL || 'https://odoo.iamalgo.com';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(`${odooUrl}/jsonrpc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: { service, method, args },
                id: Math.floor(Math.random() * 1000000)
            })
        });
        clearTimeout(timer);
        if (!res.ok) {
            throw new Error(`Odoo HTTP error ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
            throw new Error(data.error.data?.message || data.error.message || 'Odoo RPC exception');
        }
        return data.result;
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

/**
 * Authenticates against Odoo database
 */
async function getOdooAuth(env) {
    const odooDb = env.ODOO_DB || 'IAM_Main';
    const odooUser = env.ODOO_USER || 'Qruffin@iamalgo.com';
    const odooPass = env.ODOO_PASS || 'admin_master_password';
    const uid = await callOdooRpc(env, 'common', 'authenticate', [odooDb, odooUser, odooPass, {}]);
    if (!uid) {
        throw new Error(`Authentication failed for user ${odooUser} on db ${odooDb}`);
    }
    return { uid, odooDb, odooPass };
}

/**
 * Finds existing customer contact in res.partner by phone or email,
 * or creates a new customer profile under Company ID 4 (20 59 Ventures Corp).
 */
async function findOrCreateOdooPartner(env, { name, email, phone, companyName }) {
    try {
        const { uid, odooDb, odooPass } = await getOdooAuth(env);

        // Normalize phone to search last 10 digits
        const cleanDigits = phone ? phone.replace(/[^0-9]/g, '').slice(-10) : '';
        const domain = [['company_id', 'in', [4, false]]];
        if (cleanDigits && email) {
            domain.push('|', ['phone', 'ilike', cleanDigits], ['email', '=ilike', email.trim()]);
        } else if (cleanDigits) {
            domain.push(['phone', 'ilike', cleanDigits]);
        } else if (email) {
            domain.push(['email', '=ilike', email.trim()]);
        }

        if (domain.length > 1) {
            const existing = await callOdooRpc(env, 'object', 'execute_kw', [
                odooDb, uid, odooPass, 'res.partner', 'search_read',
                [domain],
                { fields: ['id', 'name', 'phone', 'email'], limit: 1 }
            ]);
            if (existing && existing.length > 0) {
                console.log(`[Odoo Contact] Matched existing partner #${existing[0].id} (${existing[0].name})`);
                return existing[0].id;
            }
        }

        // Create new contact under Company 4 (20 59 Ventures Corp)
        const partnerName = name || companyName || (phone ? `Contact (${phone})` : 'New 20 59 Ventures Contact');
        const partnerId = await callOdooRpc(env, 'object', 'execute_kw', [
            odooDb, uid, odooPass, 'res.partner', 'create',
            [{
                name: partnerName,
                is_company: !!companyName && !name,
                company_id: 4, // 20 59 Ventures Corp
                phone: phone || false,
                email: email || false,
                comment: 'Created automatically via 20 59 Ventures Telephony / Telnyx AI integration'
            }]
        ]);
        console.log(`[Odoo Contact] Created new res.partner #${partnerId} for ${partnerName}`);
        return partnerId;
    } catch (err) {
        console.warn('[Odoo findOrCreateOdooPartner]', err.message);
        return false;
    }
}

/**
 * Posts a formatted internal note directly into Chatter of any Odoo record (res.partner, crm.lead).
 * Falls back to direct mail.message creation if record-level message_post is restricted.
 */
async function postToOdooChatter(env, { model, resId, body, subject = '20 59 Ventures Activity Log' }) {
    if (!resId) return { success: false, error: 'No resId provided' };

    try {
        const { uid, odooDb, odooPass } = await getOdooAuth(env);

        try {
            // Attempt 1: Standard message_post on record
            const messageId = await callOdooRpc(env, 'object', 'execute_kw', [
                odooDb, uid, odooPass, model, 'message_post',
                [[resId]],
                {
                    body: body,
                    subject: subject,
                    message_type: 'comment',
                    subtype_xmlid: 'mail.mt_note'
                }
            ]);
            console.log(`[Odoo Chatter] message_post logged note #${messageId} to ${model} #${resId}`);
            return { success: true, messageId };
        } catch (postErr) {
            console.warn(`[Odoo Chatter] message_post fallback to mail.message create:`, postErr.message);
            // Attempt 2: Direct mail.message creation
            const messageId = await callOdooRpc(env, 'object', 'execute_kw', [
                odooDb, uid, odooPass, 'mail.message', 'create',
                [{
                    model: model,
                    res_id: resId,
                    body: body,
                    subject: subject,
                    message_type: 'comment'
                }]
            ]);
            console.log(`[Odoo Chatter] Created fallback mail.message #${messageId} on ${model} #${resId}`);
            return { success: true, messageId };
        }
    } catch (err) {
        console.warn(`[Odoo Chatter Exception] Failed to post to ${model} #${resId}:`, err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Syncs Lead or Opportunity directly to Odoo CRM and posts rich Chatter notes to both
 * the Customer Profile (res.partner) and the Opportunity (crm.lead).
 * Targets Company ID: 4 (20 59 Ventures Corp) and Team ID: 1.
 */
async function syncToOdooLead(env, { name, partnerName, contactName, email, phone, description, expectedRevenue = 0, chatterNote }) {
    try {
        const { uid, odooDb, odooPass } = await getOdooAuth(env);
        const companyId = 4;
        const teamId = parseInt(env.ODOO_TEAM_ID || '1', 10);

        // 1. Locate or create customer contact profile (res.partner)
        const partnerId = await findOrCreateOdooPartner(env, {
            name: contactName || name,
            email,
            phone,
            companyName: partnerName
        });

        // 2. Create crm.lead in Odoo under Company 4 and Team 1
        const leadId = await callOdooRpc(env, 'object', 'execute_kw', [
            odooDb, uid, odooPass, 'crm.lead', 'create',
            [{
                name: name,
                partner_id: partnerId || false,
                partner_name: partnerName || false,
                contact_name: contactName || false,
                email_from: email || false,
                phone: phone || false,
                company_id: companyId,
                team_id: teamId,
                description: description || '',
                type: 'opportunity',
                expected_revenue: expectedRevenue ? parseFloat(expectedRevenue) : 0.0
            }]
        ]);

        console.log(`[Odoo Sync] Created crm.lead #${leadId} under Company ${companyId} (Partner: #${partnerId || 'none'})`);

        // 3. Post to crm.lead Chatter
        if (leadId && chatterNote) {
            await postToOdooChatter(env, {
                model: 'crm.lead',
                resId: leadId,
                body: chatterNote,
                subject: 'Inbound Request & Conversation History'
            });
        }

        // 4. Post to res.partner Chatter
        if (partnerId && chatterNote) {
            await postToOdooChatter(env, {
                model: 'res.partner',
                resId: partnerId,
                body: chatterNote,
                subject: 'Customer Request & Telephony Record'
            });
        }

        return { success: true, leadId, partnerId };
    } catch (err) {
        console.warn('[Odoo Sync Warning] Odoo sync error:', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Standard Web-to-CRM Lead & TCPA Opt-In Sync
 */
async function syncToOdoo({ name, email, phone, formType, data, clientIp, clientTimestamp, transactionalConsent, marketingConsent, env }) {
    try {
        const leadDescription = `Website Inquiry from 2059ventures.online\n\nForm: ${formType}\nContact: ${name}\nEmail: ${email || 'None'}\nPhone: ${phone || 'None'}\n\nSubmission Data:\n${JSON.stringify(data, null, 2)}\n\nTCPA & Opt-In Compliance Audit:\n- Transactional Consent: ${transactionalConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}\n- Marketing Consent: ${marketingConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}\n- Timestamp: ${clientTimestamp}\n- IP Signature: ${clientIp}`;

        const chatterHtml = `
            <div style="font-family: sans-serif; font-size: 13px; line-height: 1.5;">
                <p style="margin: 0 0 8px 0;"><strong>Web-to-CRM Lead Submission (2059ventures.online)</strong></p>
                <ul style="margin: 0 0 10px 0; padding-left: 20px;">
                    <li><strong>Form:</strong> ${formType}</li>
                    <li><strong>Contact:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email || 'N/A'}</li>
                    <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
                </ul>
                <div style="background: #f1f5f9; border-left: 3px solid #256041; padding: 10px; margin-top: 10px; font-size: 12px;">
                    <strong>TCPA Compliance Record:</strong><br>
                    &bull; Transactional SMS Consent: <b>${transactionalConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}</b><br>
                    &bull; Marketing SMS Consent: <b>${marketingConsent ? 'YES (Affirmative Opt-in Checked)' : 'NO'}</b><br>
                    &bull; Client IP Signature: ${clientIp}<br>
                    &bull; Timestamp: ${clientTimestamp}
                </div>
            </div>
        `;

        const result = await syncToOdooLead(env, {
            name: `[${formType}] ${name}`,
            contactName: name,
            email: email || false,
            phone: phone || false,
            description: leadDescription,
            chatterNote: chatterHtml
        });

        return result.success;
    } catch (err) {
        console.warn('[Odoo syncToOdoo Exception]', err.message);
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Telnyx SMS & MMS Telephony Engine
// Bidirectional Outbound Tracking & Inbound Webhook Processing
// Toll-Free Outbound: +18889192059 | Profile ID: 40019b37-3f98-4fd3-9476-2554b33f3b6f
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sends transactional SMS/MMS via Telnyx Messaging API and automatically logs
 * outbound messages and attached media thumbnails into Odoo Chatter.
 * Accepts: { to, text, mediaUrls = [], partnerId = null, leadId = null }
 */
async function sendTelnyxSms(env, { to, text, mediaUrls = [], partnerId = null, leadId = null }) {
    const apiKey = env.TELNYX_API_KEY;
    if (!apiKey || !to || !text) return { success: false, error: 'Missing required parameters (apiKey, to, or text)' };

    try {
        let cleanPhone = to.replace(/[^0-9+]/g, '');
        if (!cleanPhone.startsWith('+')) {
            cleanPhone = '+1' + cleanPhone.replace(/^1/, '');
        }

        const fromNumber = env.TELNYX_FROM_NUMBER || '+18889192059';
        const profileId = env.TELNYX_MESSAGING_PROFILE_ID || '40019b37-3f98-4fd3-9476-2554b33f3b6f';

        const payload = {
            from: fromNumber,
            to: cleanPhone,
            text: text,
            messaging_profile_id: profileId
        };

        if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
            payload.media_urls = mediaUrls;
        }

        const res = await fetch('https://api.telnyx.com/v2/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        const messageId = data?.data?.id || 'queued';
        const mediaList = Array.isArray(mediaUrls) ? mediaUrls : [];

        // Log outbound SMS/MMS to Odoo Chatter (res.partner & crm.lead)
        try {
            const targetPartnerId = partnerId || await findOrCreateOdooPartner(env, { phone: cleanPhone });

            const outboundNote = `
<div style="font-family: Arial, sans-serif; padding: 4px;">
    <h4 style="color: #256041; margin: 0 0 6px 0;">📤 Telnyx Outbound ${mediaList.length > 0 ? 'MMS / SMS' : 'SMS'} Sent</h4>
    <p style="font-size: 12px; margin: 0 0 6px 0;"><strong>To:</strong> <a href="tel:${cleanPhone}">${cleanPhone}</a> | <strong>From:</strong> ${fromNumber} (20 59 Ventures Toll-Free)</p>
    <div style="background: #f0fdf4; padding: 10px 14px; border-left: 3px solid #256041; font-size: 13px; color: #0f172a; line-height: 1.5; white-space: pre-wrap;">${text}</div>
    ${mediaList.length > 0 ? `
    <div style="margin-top: 8px;">
        <strong style="font-size: 12px; color: #256041;">📎 Attached MMS Media:</strong>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;">
            ${mediaList.map(url => `<a href="${url}" target="_blank"><img src="${url}" style="max-width: 180px; max-height: 180px; border-radius: 4px; border: 1px solid #cbd5e1;" /></a>`).join('')}
        </div>
    </div>` : ''}
    <p style="font-size: 11px; color: #94a3b8; margin: 6px 0 0 0;">Telnyx Message ID: ${messageId}</p>
</div>`;

            if (targetPartnerId) {
                await postToOdooChatter(env, {
                    model: 'res.partner',
                    resId: targetPartnerId,
                    body: outboundNote,
                    subject: `Outbound ${mediaList.length > 0 ? 'MMS' : 'SMS'}`
                });
            }

            if (leadId) {
                await postToOdooChatter(env, {
                    model: 'crm.lead',
                    resId: leadId,
                    body: outboundNote,
                    subject: `Outbound ${mediaList.length > 0 ? 'MMS' : 'SMS'}`
                });
            }
        } catch (odooErr) {
            console.warn('[Odoo Outbound SMS Chatter Error]', odooErr.message);
        }

        return { success: res.ok, messageId, data };
    } catch (err) {
        console.warn('[Telnyx SMS Exception]', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Handles incoming Telnyx Telephony & Messaging Webhooks
 * Endpoint: POST /api/telnyx/webhook
 */
async function handleTelnyxWebhook(request, env) {
    try {
        const body = await request.json();
        const eventType = body?.data?.event_type || body?.event_type;
        const payload = body?.data?.payload || body?.payload;

        console.log(`[Telnyx Webhook] Received event: ${eventType} (ID: ${payload?.id})`);

        // -------------------------------------------------------------
        // 1. INBOUND SMS & MMS EVENTS (message.received)
        // -------------------------------------------------------------
        if (eventType === 'message.received') {
            const fromNumber = payload?.from?.phone_number || payload?.from || 'Unknown';
            const toNumber = payload?.to?.[0]?.phone_number || payload?.to || '+18889192059';
            const messageText = payload?.text || '';
            const messageId = payload?.id || '';
            const mediaList = Array.isArray(payload?.media) ? payload.media : [];

            // Rich HTML card for Odoo Chatter & Team Email Alert
            const smsChatterNote = `
<div style="font-family: Arial, sans-serif; padding: 4px;">
    <h4 style="color: #256041; margin: 0 0 6px 0;">📥 Telnyx Inbound ${mediaList.length > 0 ? 'MMS / SMS' : 'SMS'} Received</h4>
    <p style="font-size: 12px; margin: 0 0 6px 0;"><strong>From:</strong> <a href="tel:${fromNumber}">${fromNumber}</a> | <strong>To:</strong> ${toNumber}</p>
    ${messageText ? `<div style="background: #f8fafc; padding: 10px 14px; border-left: 3px solid #256041; font-size: 13px; color: #1e293b; line-height: 1.5; white-space: pre-wrap;">${messageText}</div>` : ''}
    ${mediaList.length > 0 ? `
    <div style="margin-top: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 14px; border-radius: 6px;">
        <strong style="color: #166534; font-size: 12px;">📎 Attached MMS Media / Documents (${mediaList.length}):</strong>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
            ${mediaList.map(m => {
                const isImage = (m.content_type || '').startsWith('image/');
                return `
                <div style="display: inline-block; text-align: center;">
                    <a href="${m.url}" target="_blank" style="text-decoration: none; display: inline-block;">
                        ${isImage ? `<img src="${m.url}" style="max-width: 220px; max-height: 220px; border-radius: 6px; border: 1px solid #cbd5e1; display: block;" />` : `<div style="padding: 12px 16px; background: #ffffff; border-radius: 6px; font-size: 12px; color: #0f172a; border: 1px solid #cbd5e1;">📄 Download Document (${m.content_type || 'File'})</div>`}
                    </a>
                    <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${m.content_type || ''} ${m.size ? `(${Math.round(m.size / 1024)} KB)` : ''}</div>
                </div>`;
            }).join('')}
        </div>
    </div>` : ''}
    <p style="font-size: 11px; color: #94a3b8; margin: 8px 0 0 0;">Telnyx Message ID: ${messageId}</p>
</div>`;

            // Step A: Forward to Team Email Alert
            try {
                await sendTelnyxEmail(env, {
                    to: DEFAULT_EMAIL_RECIPIENTS,
                    subject: `[INBOUND ${mediaList.length > 0 ? 'MMS' : 'SMS'}] From ${fromNumber} to ${toNumber}`,
                    text: `Inbound ${mediaList.length > 0 ? 'MMS' : 'SMS'} from ${fromNumber}:\n\n${messageText}\n\nMedia URLs:\n${mediaList.map(m => m.url).join('\n')}\n\nTelnyx Message ID: ${messageId}`,
                    html: smsChatterNote,
                    replyTo: 'support@2059ventures.com',
                    fromName: '20/59 SMS Dispatch'
                });
            } catch (emailErr) {
                console.warn('[Telnyx Webhook Email Alert Error]', emailErr.message);
            }

            // Step B: Find or create customer contact (res.partner) under Company 4 (20 59 Ventures Corp)
            const partnerId = await findOrCreateOdooPartner(env, {
                phone: fromNumber,
                name: `SMS Contact (${fromNumber})`
            });

            // Step C: Post directly to customer contact Chatter (res.partner)
            if (partnerId) {
                await postToOdooChatter(env, {
                    model: 'res.partner',
                    resId: partnerId,
                    body: smsChatterNote,
                    subject: `Inbound ${mediaList.length > 0 ? 'MMS' : 'SMS'} Received`
                });
            }

            // Step D: Create/Update Opportunity under crm.lead under Company 4 and Team 1
            const leadResult = await syncToOdooLead(env, {
                name: `SMS/MMS from ${fromNumber}`,
                partnerName: false,
                contactName: `SMS Contact (${fromNumber})`,
                email: false,
                phone: fromNumber,
                description: `Inbound ${mediaList.length > 0 ? 'MMS' : 'SMS'} received via Telnyx (+1-888-919-2059):\n\n${messageText}\n\nMedia URLs: ${mediaList.map(m => m.url).join(', ') || 'None'}\nMessage ID: ${messageId}`,
                expectedRevenue: 0,
                chatterNote: smsChatterNote
            });

            return jsonResponse({
                status: 'sms_logged',
                partnerId: partnerId || null,
                leadId: leadResult?.leadId || null,
                messageId: messageId
            }, 200);
        }

        // -------------------------------------------------------------
        // 2. OUTBOUND SENT / FINALIZED CALLBACKS
        // -------------------------------------------------------------
        if (eventType === 'message.sent' || eventType === 'message.finalized') {
            console.log(`[Telnyx Webhook] Status callback ${eventType}: ${payload?.id}`);
            return jsonResponse({
                status: 'message_acknowledged',
                event: eventType,
                messageId: payload?.id
            }, 200);
        }

        return jsonResponse({ status: 'received', event: eventType }, 200);
    } catch (err) {
        console.error('[Telnyx Webhook Error]', err);
        return jsonResponse({ error: err.message }, 500);
    }
}

/**
 * Handles Outbound SMS API requests from front-end or internal systems
 * Endpoint: POST /api/sms
 */
async function handleSmsDispatch(request, env) {
    try {
        const body = await request.json();
        const { to, text, mediaUrls = [], partnerId = null, leadId = null } = body;

        if (!to || !text) {
            return jsonResponse({ error: 'Recipient "to" and message "text" are required.' }, 400);
        }

        const result = await sendTelnyxSms(env, { to, text, mediaUrls, partnerId, leadId });
        return jsonResponse(result, result.success ? 200 : 500);
    } catch (err) {
        console.error('[handleSmsDispatch Error]', err);
        return jsonResponse({ error: err.message }, 500);
    }
}

// ── Handle Online Participant Intake Form (via Telnyx Email API) ────────────
async function handlePublicIntake(request, env, ctx) {
    try {
        const body = await request.json();
        const clientIp = request.headers.get('cf-connecting-ip') || 'Direct';
        const clientCountry = (request.headers.get('cf-ipcountry') || 'US').toUpperCase();

        const spamCheck = isSpamSubmission(body, clientIp, clientCountry);
        if (spamCheck.isSpam) {
            console.warn(`[Spam Shield Dropped Intake] Dropped (${spamCheck.reason}) from IP: ${clientIp} (${clientCountry})`);
            return jsonResponse({
                success: true,
                message: 'Thank you for reaching out. We have received your inquiry and will be in touch shortly!',
                shielded: true
            }, 200);
        }

        const {
            fullName, dob, phone, email, livingSituation, homelessDuration,
            referralAgency, caseManager, referralContact, housingNeedSummary,
            veteranStatus, hudVash, monthlyIncome, incomeSources,
            signatureData, signatureDate, housingPreference
        } = body;

        if (!fullName) {
            return jsonResponse({ error: 'Full name is required.' }, 400);
        }

        const incomeSourcesList = Array.isArray(incomeSources) ? incomeSources.join(', ') : (incomeSources || 'None specified');
        const formattedIncome = typeof monthlyIncome === 'number' ? `$${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : (monthlyIncome || '$0.00');

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff; color: #1e293b;">
            <div style="background-color: #0d1b2a; color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #f39c12;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">20/59 Ventures • Participant Intake Application</h2>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">Submitted via Online Intake Portal</p>
            </div>
            
            <div style="padding: 24px;">
              <!-- Referral Coordinator Info -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 18px;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; font-weight: 700;">Referring Coordinator / Agency</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr><td style="padding: 4px 0; color: #64748b; width: 35%;">Coordinator Name:</td><td style="padding: 4px 0; font-weight: 600;">${caseManager || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Agency / Organization:</td><td style="padding: 4px 0; font-weight: 600;">${referralAgency || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Contact Details:</td><td style="padding: 4px 0;">${referralContact || 'N/A'}</td></tr>
                </table>
              </div>

              <!-- Participant Demographics -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 18px;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; font-weight: 700;">Participant Demographics</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr><td style="padding: 4px 0; color: #64748b; width: 35%;">Full Name:</td><td style="padding: 4px 0; font-weight: 700; color: #0d1b2a; font-size: 15px;">${fullName}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Date of Birth:</td><td style="padding: 4px 0;">${dob || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Phone:</td><td style="padding: 4px 0;">${phone || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Email:</td><td style="padding: 4px 0;">${email || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Living Situation:</td><td style="padding: 4px 0; font-weight: 600; color: #b45309;">${livingSituation || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Homeless Duration:</td><td style="padding: 4px 0;">${homelessDuration || 'N/A'}</td></tr>
                </table>
              </div>

              <!-- Military & Benefits -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 18px;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; font-weight: 700;">Military & Benefits</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr><td style="padding: 4px 0; color: #64748b; width: 35%;">Veteran Status:</td><td style="padding: 4px 0; font-weight: 700; color: #1e3a8a;">${veteranStatus || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">HUD-VASH Voucher:</td><td style="padding: 4px 0; font-weight: 600;">${hudVash || 'N/A'}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Monthly Income:</td><td style="padding: 4px 0; font-weight: 700; color: #15803d;">${formattedIncome}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Income Sources:</td><td style="padding: 4px 0;">${incomeSourcesList}</td></tr>
                  <tr><td style="padding: 4px 0; color: #64748b;">Housing Preference:</td><td style="padding: 4px 0;">${housingPreference || 'N/A'}</td></tr>
                </table>
              </div>

              <!-- Placement Needs & Certification -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 18px;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; font-weight: 700;">Placement Need & Certification</h3>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #334155; line-height: 1.5;">${housingNeedSummary || 'None provided'}</p>
                <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 13px; color: #64748b;">
                  <div><strong>Signature / Certification:</strong> ${signatureData || 'Certified'}</div>
                  <div><strong>Date Signed:</strong> ${signatureDate || new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              20/59 Ventures Housing Placement Team &bull; support@2059ventures.com
            </div>
          </div>
        `;

        const plainText = `
20/59 VENTURES - NEW PARTICIPANT INTAKE APPLICATION
===================================================
Participant: ${fullName} (DOB: ${dob || 'N/A'})
Phone: ${phone || 'N/A'} | Email: ${email || 'N/A'}
Living Situation: ${livingSituation || 'N/A'} (${homelessDuration || 'N/A'})

Referring Agency: ${referralAgency || 'N/A'}
Coordinator: ${caseManager || 'N/A'} (${referralContact || 'N/A'})

Veteran Status: ${veteranStatus || 'N/A'}
HUD-VASH: ${hudVash || 'N/A'}
Monthly Income: ${formattedIncome} (${incomeSourcesList})
Preference: ${housingPreference || 'N/A'}

Placement Summary:
${housingNeedSummary || 'None'}

Signed: ${signatureData || 'Certified'} on ${signatureDate || 'N/A'}
        `.trim();

        // 1. Dispatch email immediately via Telnyx Email API
        const emailResult = await sendTelnyxEmail(env, {
            subject: `[NEW INTAKE] Housing Application - ${fullName}`,
            text: plainText,
            html: htmlContent,
            replyTo: body.email || (referralContact && referralContact.includes('@') ? referralContact.match(/[\w.-]+@[\w.-]+/)?.[0] : undefined),
            fromName: '20/59 Intake Portal'
        });

        // Forward to Odoo CRM in background with TCPA & Intake details
        if (ctx && typeof ctx.waitUntil === 'function') {
            ctx.waitUntil(syncToOdoo({
                name: fullName,
                email: body.email || '',
                phone: phone,
                formType: 'Housing Intake Application',
                data: body,
                clientIp: request.headers.get('cf-connecting-ip') || 'Direct',
                clientTimestamp: new Date().toISOString(),
                transactionalConsent: true,
                marketingConsent: false,
                env
            }));
        }

        // 2. Forward to Azure Housing Platform in background
        if (ctx && typeof ctx.waitUntil === 'function') {
            ctx.waitUntil((async () => {
                try {
                    const azureRes = await fetch('https://housing-platform-a2btefckcwf9apcd.centralus-01.azurewebsites.net/api/public/intake', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    console.log('[Intake Proxy] Azure responded with status:', azureRes.status);
                } catch (azErr) {
                    console.warn('[Intake Proxy] Azure forward warning:', azErr.message);
                }
            })());
        }

        return jsonResponse({
            status: 'Success',
            message: 'Application processed and email notification dispatched successfully.',
            telnyxMessageId: emailResult.messageId
        }, 200);

    } catch (err) {
        console.error('[Intake Error]', err);
        return jsonResponse({ error: err.message }, 500);
    }
}

// ── Handle Scanned Intake Document Upload (via Telnyx Email API with Attachment) ──
async function handleIntakeUpload(request, env, ctx) {
    try {
        const body = await request.json();
        const { referrerName, referrerAgency, referrerEmail, referrerPhone, clientName, clientDob, notes, fileName, fileType, fileBase64, timestamp } = body;

        if (!clientName || !referrerName || !fileBase64) {
            return jsonResponse({ error: 'Missing required participant name, coordinator name, or file attachment.' }, 400);
        }

        const uploadTime = timestamp || new Date().toLocaleString();

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #4A7C59; color: #ffffff; padding: 24px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">20/59 Ventures • New Scanned Intake Packet</h2>
              <p style="margin: 6px 0 0 0; color: #eaf3ed; font-size: 14px;">Paper Application Upload (SOP-2059-FORM-005)</p>
            </div>
            <div style="padding: 24px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Participant Name:</td><td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${clientName}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Date of Birth:</td><td style="padding: 6px 0; color: #0f172a;">${clientDob || 'N/A'}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Referring Coordinator:</td><td style="padding: 6px 0; color: #0f172a;">${referrerName}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Agency / Hospital:</td><td style="padding: 6px 0; color: #0f172a;">${referrerAgency || 'N/A'}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Coordinator Email:</td><td style="padding: 6px 0; color: #0f172a;">${referrerEmail || 'N/A'}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Coordinator Phone:</td><td style="padding: 6px 0; color: #0f172a;">${referrerPhone || 'N/A'}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Attached File:</td><td style="padding: 6px 0; color: #0f172a;">${fileName}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Placement Notes:</td><td style="padding: 6px 0; color: #0f172a;">${notes || 'None provided'}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Received:</td><td style="padding: 6px 0; color: #64748b;">${uploadTime}</td></tr>
                </table>
              </div>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
                The completed paper application is attached to this email. Please review the participant's independent living acknowledgment and housing accommodations request.
              </p>
            </div>
            <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 12px; color: #64748b;">
              20/59 Ventures Operations &bull; support@2059ventures.com
            </div>
          </div>
        `;

        const emailResult = await sendTelnyxEmail(env, {
            subject: `[Paper Intake Upload] ${clientName} - ${referrerAgency || 'Referral'}`,
            text: `Scanned intake application received for ${clientName} from coordinator ${referrerName} (${referrerAgency || 'Agency'}). File: ${fileName}.`,
            html: htmlContent,
            replyTo: referrerEmail || undefined,
            fromName: '20/59 Intake Portal',
            attachments: [
                {
                    filename: fileName || 'Completed-Intake-Application.pdf',
                    content_type: fileType || 'application/pdf',
                    content: fileBase64
                }
            ]
        });

        return jsonResponse({
            success: true,
            message: 'Intake document uploaded and email notification dispatched.',
            telnyxMessageId: emailResult.messageId
        }, 200);

    } catch (err) {
        console.error('[Intake Upload Error]', err);
        return jsonResponse({ error: err.message }, 500);
    }
}

// ── LinkedIn Conversions API Handler & Helpers ──────────────────────────────
async function handleLinkedInConversion(request, env) {
    try {
        const body = await request.json();
        const result = await sendLinkedInConversionEvent(body, env);
        return jsonResponse(result, result.success ? 200 : 400);
    } catch (err) {
        console.error('[LinkedIn CAPI] Handler Error:', err);
        return jsonResponse({ error: err.message }, 500);
    }
}

async function sha256Hex(text) {
    if (!text) return '';
    const cleanText = text.trim().toLowerCase();
    const encoder = new TextEncoder();
    const data = encoder.encode(cleanText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendLinkedInConversionEvent(data, env) {
    const accessToken = env.LINKEDIN_ACCESS_TOKEN;
    if (!accessToken) {
        console.warn('[LinkedIn CAPI] LINKEDIN_ACCESS_TOKEN not set in environment.');
        return { success: false, error: 'LINKEDIN_ACCESS_TOKEN not configured in Worker' };
    }

    const { email, phone, name, eventName, liFatId, conversionValue } = data;

    const userIds = [];
    if (email) {
        const hashedEmail = await sha256Hex(email);
        userIds.push({
            idType: 'SHA256_EMAIL',
            idValue: hashedEmail
        });
    }

    if (phone) {
        let cleanPhone = phone.replace(/[^0-9+]/g, '');
        if (!cleanPhone.startsWith('+')) {
            cleanPhone = '+1' + cleanPhone.replace(/^1/, '');
        }
        const hashedPhone = await sha256Hex(cleanPhone);
        userIds.push({
            idType: 'SHA256_PHONE',
            idValue: hashedPhone
        });
    }

    if (liFatId) {
        userIds.push({
            idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
            idValue: liFatId
        });
    }

    if (userIds.length === 0) {
        return { success: false, error: 'At least one user identifier required' };
    }

    const CONVERSION_RULE_IDS = {
        'Lead': 'urn:lla:llaPartnerConversion:21674394',
        'Contact': 'urn:lla:llaPartnerConversion:21674394',
        'Intake': 'urn:lla:llaPartnerConversion:21674394',
        'Housing Inquiry': 'urn:lla:llaPartnerConversion:21674394',
        'Agency Partner': 'urn:lla:llaPartnerConversion:21674394',
        'Property Owner': 'urn:lla:llaPartnerConversion:21674394',
        'Default': 'urn:lla:llaPartnerConversion:21674394'
    };

    const conversionRule = CONVERSION_RULE_IDS[eventName] || CONVERSION_RULE_IDS['Default'];

    const payload = {
        conversion: conversionRule,
        conversionHappenedAt: Date.now(),
        user: {
            userIds: userIds
        }
    };

    if (conversionValue && parseFloat(conversionValue) > 0) {
        payload.conversionValue = {
            currencyCode: 'USD',
            amount: parseFloat(conversionValue).toFixed(2)
        };
    }

    try {
        const res = await fetch('https://api.linkedin.com/rest/conversionEvents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'LinkedIn-Version': '202401',
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 201 || res.status === 204) {
            console.log(`[LinkedIn CAPI] Event "${eventName}" sent successfully`);
            return { success: true, event: eventName };
        } else {
            const errText = await res.text();
            console.error(`[LinkedIn CAPI] Error ${res.status}:`, errText);
            return { success: false, status: res.status, error: errText };
        }
    } catch (err) {
        console.error('[LinkedIn CAPI] Network error:', err);
        return { success: false, error: err.message };
    }
}

// ── LinkedIn Lead Gen Forms Webhook Handler ─────────────────────────────────
async function handleLinkedInLeadWebhook(request, env) {
    if (request.method === 'GET') {
        const url = new URL(request.url);
        const challenge = url.searchParams.get('challenge');
        if (challenge) {
            return new Response(challenge, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
        return jsonResponse({ status: 'active', service: 'LinkedIn Lead Webhook' }, 200);
    }

    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
        const body = await request.json();
        console.log('[LinkedIn Webhook] Received lead event:', JSON.stringify(body).substring(0, 300));

        const leadData = body?.leadNotification || body;
        const formUrn = leadData?.formUrn || 'Unknown Form';
        const leadUrn = leadData?.leadUrn || 'Unknown Lead';

        const alertHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #0a66c2; margin-top: 0;">New LinkedIn Lead Gen Form Submission</h3>
            <p>A new lead was submitted via a LinkedIn Lead Gen Form.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #64748b;">Form:</td><td style="font-weight: bold;">${formUrn}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;">Lead ID:</td><td>${leadUrn}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;">Timestamp:</td><td>${new Date().toISOString()}</td></tr>
            </table>
            <p style="margin-top: 16px; font-size: 13px; color: #64748b;">
              Log into LinkedIn Campaign Manager to view and export the full lead response details.
            </p>
          </div>
        `;

        await sendTelnyxEmail(env, {
            subject: `[LinkedIn Lead] New Form Submission - ${new Date().toLocaleDateString()}`,
            text: `New LinkedIn Lead Gen Form Submission received: Form ${formUrn}, Lead ID ${leadUrn}`,
            html: alertHtml,
            fromName: '20/59 LinkedIn Lead Gen'
        });

        return jsonResponse({ success: true, message: 'LinkedIn lead webhook processed' }, 200);
    } catch (err) {
        console.error('[LinkedIn Webhook] Error:', err);
        return jsonResponse({ error: err.message }, 500);
    }
}
