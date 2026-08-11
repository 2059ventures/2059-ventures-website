/**
 * _worker.js — Cloudflare Workers Assets Entry Point
 *
 * This file is the main Worker that runs alongside the static site assets.
 * It intercepts API requests and proxies everything else to the static asset handler.
 *
 * Routes handled:
 *   POST /api/chat  — Harry AI chat proxy (uses TELNYX_API_KEY secret)
 *   OPTIONS /api/chat — CORS preflight
 *   * (all others)  — Served as static assets (HTML, CSS, JS, images)
 */

const HARRY_ASSISTANT_ID = 'assistant-a13e9614-4795-4962-b7e2-abdcba418c12';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // ── Handle CORS preflight ──────────────────────────────────────────
        if (request.method === 'OPTIONS' && (url.pathname === '/api/chat' || url.pathname === '/api/lead' || url.pathname === '/api/linkedin-conversion' || url.pathname === '/api/linkedin-lead-webhook')) {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }

        // ── Handle Harry AI Chat Proxy ─────────────────────────────────────
        if (request.method === 'POST' && url.pathname === '/api/chat') {
            return handleHarryChat(request, env);
        }

        // ── Handle Harry Lead Email Alert Proxy (via Resend) ───────────────
        if (request.method === 'POST' && url.pathname === '/api/lead') {
            return handleHarryLead(request, env);
        }

        // ── Handle LinkedIn Conversions API ────────────────────────────────
        if (request.method === 'POST' && url.pathname === '/api/linkedin-conversion') {
            return handleLinkedInConversion(request, env);
        }

        // ── Handle LinkedIn Lead Webhook ───────────────────────────────────
        if (url.pathname === '/api/linkedin-lead-webhook') {
            return handleLinkedInLeadWebhook(request, env);
        }

        // ── Serve static assets (with cache-busting for HTML, CSS, JS) ──────
        const assetResponse = await env.ASSETS.fetch(request);
        const path = url.pathname.toLowerCase();
        if (path === '/' || path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js') || path.includes('harry-widget')) {
            const newHeaders = new Headers(assetResponse.headers);
            newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            newHeaders.set('Pragma', 'no-cache');
            newHeaders.set('Expires', '0');
            return new Response(assetResponse.body, {
                status: assetResponse.status,
                statusText: assetResponse.statusText,
                headers: newHeaders
            });
        }
        return assetResponse;
    }
};


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

        // ── Step 1: Create conversation if we don't have one ──────────────
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

        // ── Step 2: Chat with Harry ────────────────────────────────────────
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

        // ── Step 3: Retry with fresh conversation if 404 ──────────────────
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

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
}

async function handleHarryLead(request, env) {
    try {
        const body = await request.json();
        const { name, phone, email, leadType, inquiry, transcript, timestamp } = body;
        const resendKey = env.RESEND_API_KEY;

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
          </div>
        `;

        const recipients = ['qruffin@iamalgo.com', 'qruffin@2059ventures.online', 'info@2059ventures.online'];

        const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Harry AI Lead Alert <harry@purposehomes.limyefoundation.org>',
                to: recipients,
                subject: `[Harry AI Lead] ${leadCategory} - ${name}`,
                html: htmlContent
            })
        });

        const resendData = await resendRes.json();
        console.log('[Harry Lead] Resend API Response:', resendData);

        // ── Trigger LinkedIn Conversions API Event (Async/Background) ────────
        try {
            ctx.waitUntil(sendLinkedInConversionEvent({
                email: email,
                phone: phone,
                name: name,
                eventName: leadCategory || 'Lead',
                conversionValue: '0.00'
            }, env));
        } catch (capiErr) {
            console.error('[Harry Lead] CAPI queue warning:', capiErr);
        }

        return jsonResponse({ success: true, message: 'Lead email alert dispatched successfully', resend: resendData }, 200);
    } catch (err) {
        console.error('[Harry Lead] Worker error:', err);
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
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone) {
            const hashedPhone = await sha256Hex(cleanPhone);
            userIds.push({
                idType: 'SHA256_PHONE',
                idValue: hashedPhone
            });
        }
    }
    if (liFatId) {
        userIds.push({
            idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
            idValue: liFatId
        });
    }

    let firstName = '';
    let lastName = '';
    if (name) {
        const parts = name.trim().split(/\s+/);
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
    }

    const payload = {
        conversionHappenedAt: Date.now(),
        conversionValue: {
            currencyCode: 'USD',
            amount: conversionValue || '0.00'
        },
        user: {
            userIds: userIds,
            userInfo: {
                firstName: firstName,
                lastName: lastName
            }
        }
    };

    try {
        const res = await fetch('https://api.linkedin.com/rest/conversionEvents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'LinkedIn-Version': '202401',
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const resText = await res.text();
        let resJson = {};
        try { resJson = JSON.parse(resText); } catch (e) {}

        if (res.ok || res.status === 201) {
            console.log('[LinkedIn CAPI] Event logged successfully:', res.status);
            return { success: true, status: res.status, data: resJson };
        } else {
            console.error('[LinkedIn CAPI] API status error:', res.status, resText);
            return { success: false, status: res.status, message: resText };
        }
    } catch (err) {
        console.error('[LinkedIn CAPI] Event transmission failed:', err);
        return { success: false, error: err.message };
    }
}

// ── LinkedIn Lead Webhook Handler (Organic & Paid Lead Gen Integration) ────
async function handleLinkedInLeadWebhook(request, env) {
    try {
        const resendKey = env.RESEND_API_KEY;
        const body = await request.json().catch(() => ({}));
        
        console.log('[LinkedIn Webhook] Inbound Lead Data:', JSON.stringify(body));

        const name = body.name || body.fullName || body.firstName ? `${body.firstName || ''} ${body.lastName || ''}`.trim() : 'LinkedIn Lead';
        const email = body.email || body.emailAddress || 'N/A';
        const phone = body.phone || body.phoneNumber || 'N/A';
        const organization = body.company || body.organization || 'N/A';
        const leadCategory = body.leadCategory || 'LinkedIn Inquiry / Referral';

        if (resendKey) {
            const htmlContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #0077b5; color: #ffffff; padding: 24px; text-align: center;">
                  <h2 style="margin: 0; font-size: 22px;">20/59 Ventures • LinkedIn Lead Alert</h2>
                  <p style="margin: 6px 0 0 0; color: #e0f2fe; font-size: 14px;">Captured via LinkedIn Webhook Integration</p>
                </div>
                <div style="padding: 24px;">
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Lead Name:</td><td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${name}</td></tr>
                      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Phone:</td><td style="padding: 6px 0; color: #0f172a;">${phone}</td></tr>
                      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Email:</td><td style="padding: 6px 0; color: #0f172a;">${email}</td></tr>
                      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Organization:</td><td style="padding: 6px 0; color: #0f172a;">${organization}</td></tr>
                      <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Timestamp:</td><td style="padding: 6px 0; color: #64748b;">${new Date().toLocaleString()}</td></tr>
                    </table>
                  </div>
                </div>
              </div>
            `;

            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'LinkedIn Lead Alert <harry@purposehomes.limyefoundation.org>',
                    to: ['qruffin@2059ventures.online', 'andrea.marcus@2059ventures.online', 'info@2059ventures.online'],
                    subject: `[LinkedIn Lead] ${leadCategory} - ${name}`,
                    html: htmlContent
                })
            });
        }

        return jsonResponse({ success: true, message: 'LinkedIn lead webhook processed' }, 200);
    } catch (err) {
        console.error('[LinkedIn Webhook] Error:', err);
        return jsonResponse({ error: err.message }, 500);
    }
}



