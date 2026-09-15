// Cloudflare Pages Function: /api/sms
// Sends outbound transactional SMS & MMS via Telnyx and logs into Odoo Chatter

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

async function findOrCreateOdooPartner(env, { phone }) {
    try {
        const { uid, odooDb, odooPass } = await getOdooAuth(env);
        const cleanDigits = phone ? phone.replace(/[^0-9]/g, '').slice(-10) : '';
        const domain = [['company_id', 'in', [4, false]]];
        if (cleanDigits) domain.push(['phone', 'ilike', cleanDigits]);

        if (domain.length > 1) {
            const existing = await callOdooRpc(env, 'object', 'execute_kw', [
                odooDb, uid, odooPass, 'res.partner', 'search_read',
                [domain],
                { fields: ['id', 'name', 'phone'], limit: 1 }
            ]);
            if (existing && existing.length > 0) return existing[0].id;
        }

        const partnerName = phone ? `Contact (${phone})` : 'New 20 59 Ventures Contact';
        const partnerId = await callOdooRpc(env, 'object', 'execute_kw', [
            odooDb, uid, odooPass, 'res.partner', 'create',
            [{
                name: partnerName,
                company_id: 4,
                phone: phone || false,
                comment: 'Created automatically via 20 59 Ventures Telephony / Telnyx AI integration'
            }]
        ]);
        return partnerId;
    } catch (err) {
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

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const apiKey = env.TELNYX_API_KEY;

    if (!apiKey) {
        return jsonResponse({ error: 'TELNYX_API_KEY not configured' }, 500);
    }

    try {
        const body = await request.json();
        const { to, text, mediaUrls = [], partnerId = null, leadId = null } = body;

        if (!to || !text) {
            return jsonResponse({ error: 'Recipient "to" and message "text" are required.' }, 400);
        }

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
        } catch (odooErr) {}

        return jsonResponse({ success: res.ok, messageId, data }, res.ok ? 200 : 500);
    } catch (err) {
        return jsonResponse({ error: err.message }, 500);
    }
}
