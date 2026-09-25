// Cloudflare Pages Function: /api/telnyx/webhook
// Handles incoming Telnyx Telephony & Messaging Webhooks with Odoo Chatter sync

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const DEFAULT_EMAIL_RECIPIENTS = [
    { email: 'support@2059ventures.com', name: '20/59 Support' },
    { email: 'qruffin@2059ventures.com', name: 'Quincy Ruffin' },
    { email: 'info@2059ventures.com', name: '20/59 Info' },
    { email: 'andrea.marcus@2059ventures.com', name: 'Andrea Marcus' }
];

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
}

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
        if (!res.ok) throw new Error(`Odoo HTTP error ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error.data?.message || data.error.message || 'Odoo RPC exception');
        return data.result;
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

async function getOdooAuth(env) {
    const odooDb = env.ODOO_DB || 'IAM_Main';
    const odooUser = env.ODOO_USER || 'Qruffin@iamalgo.com';
    const odooPass = env.ODOO_PASS || 'admin_master_password';
    const uid = await callOdooRpc(env, 'common', 'authenticate', [odooDb, odooUser, odooPass, {}]);
    if (!uid) throw new Error(`Authentication failed for user ${odooUser} on db ${odooDb}`);
    return { uid, odooDb, odooPass };
}

async function findOrCreateOdooPartner(env, { name, email, phone, companyName }) {
    try {
        const { uid, odooDb, odooPass } = await getOdooAuth(env);
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
            if (existing && existing.length > 0) return existing[0].id;
        }

        const partnerName = name || companyName || (phone ? `Contact (${phone})` : 'New 20 59 Ventures Contact');
        const partnerId = await callOdooRpc(env, 'object', 'execute_kw', [
            odooDb, uid, odooPass, 'res.partner', 'create',
            [{
                name: partnerName,
                is_company: !!companyName && !name,
                company_id: 4,
                phone: phone || false,
                email: email || false,
                comment: 'Created automatically via 20 59 Ventures Telephony / Telnyx AI integration'
            }]
        ]);
        return partnerId;
    } catch (err) {
        console.warn('[Odoo findOrCreateOdooPartner]', err.message);
        return false;
    }
}

async function postToOdooChatter(env, { model, resId, body, subject = '20 59 Ventures Activity Log' }) {
    if (!resId) return { success: false, error: 'No resId provided' };

    try {
        const { uid, odooDb, odooPass } = await getOdooAuth(env);
        try {
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
            return { success: true, messageId };
        } catch (postErr) {
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
            return { success: true, messageId };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function syncToOdooLead(env, { name, partnerName, contactName, email, phone, description, expectedRevenue = 0, chatterNote }) {
    try {
        const { uid, odooDb, odooPass } = await getOdooAuth(env);
        const companyId = 4;
        const teamId = parseInt(env.ODOO_TEAM_ID || '1', 10);

        const partnerId = await findOrCreateOdooPartner(env, {
            name: contactName || name,
            email,
            phone,
            companyName: partnerName
        });

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

        if (leadId && chatterNote) {
            await postToOdooChatter(env, {
                model: 'crm.lead',
                resId: leadId,
                body: chatterNote,
                subject: 'Inbound Request & Conversation History'
            });
        }

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
        return { success: false, error: err.message };
    }
}

async function sendTelnyxEmail(env, { to, subject, text, html, replyTo, fromName = '20/59 Ventures' }) {
    const apiKey = env.TELNYX_API_KEY;
    if (!apiKey) return { success: false, error: 'TELNYX_API_KEY not configured' };

    let recipients = DEFAULT_EMAIL_RECIPIENTS;
    if (Array.isArray(to) && to.length > 0) {
        recipients = to.map(r => typeof r === 'string' ? { email: r, name: r } : { email: r.email, name: r.name || r.email });
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

    if (replyTo) payload.reply_to = replyTo;

    try {
        const res = await fetch('https://api.telnyx.com/v2/email_messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        return { success: res.ok, messageId: data?.data?.id };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const eventType = body?.data?.event_type || body?.event_type;
        const payload = body?.data?.payload || body?.payload;

        console.log(`[Telnyx Webhook Pages] Received event: ${eventType} (ID: ${payload?.id})`);

        if (eventType === 'message.received') {
            const fromNumber = payload?.from?.phone_number || payload?.from || 'Unknown';
            const toNumber = payload?.to?.[0]?.phone_number || payload?.to || '+18889192059';
            const messageText = payload?.text || '';
            const messageId = payload?.id || '';
            const mediaList = Array.isArray(payload?.media) ? payload.media : [];

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

            try {
                await sendTelnyxEmail(env, {
                    to: DEFAULT_EMAIL_RECIPIENTS,
                    subject: `[INBOUND ${mediaList.length > 0 ? 'MMS' : 'SMS'}] From ${fromNumber} to ${toNumber}`,
                    text: `Inbound ${mediaList.length > 0 ? 'MMS' : 'SMS'} from ${fromNumber}:\n\n${messageText}\n\nMedia URLs:\n${mediaList.map(m => m.url).join('\n')}\n\nTelnyx Message ID: ${messageId}`,
                    html: smsChatterNote,
                    replyTo: 'support@2059ventures.com',
                    fromName: '20/59 SMS Dispatch'
                });
            } catch (e) {}

            const partnerId = await findOrCreateOdooPartner(env, {
                phone: fromNumber,
                name: `SMS Contact (${fromNumber})`
            });

            if (partnerId) {
                await postToOdooChatter(env, {
                    model: 'res.partner',
                    resId: partnerId,
                    body: smsChatterNote,
                    subject: `Inbound ${mediaList.length > 0 ? 'MMS' : 'SMS'} Received`
                });
            }

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

        if (eventType === 'message.sent' || eventType === 'message.finalized') {
            return jsonResponse({
                status: 'message_acknowledged',
                event: eventType,
                messageId: payload?.id
            }, 200);
        }

        return jsonResponse({ status: 'received', event: eventType }, 200);
    } catch (err) {
        console.error('[Telnyx Webhook Pages Error]', err);
        return jsonResponse({ error: err.message }, 500);
    }
}
