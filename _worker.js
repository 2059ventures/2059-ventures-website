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
        if (request.method === 'OPTIONS' && (url.pathname === '/api/chat' || url.pathname === '/api/lead')) {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }

        // ── Handle Harry AI Chat Proxy ─────────────────────────────────────
        if (request.method === 'POST' && url.pathname === '/api/chat') {
            return handleHarryChat(request, env);
        }

        // ── Handle Harry Lead Email Alert Proxy (via Resend) ───────────────
        if (request.method === 'POST' && url.pathname === '/api/lead') {
            return fetch('https://voice.iamalgo.com/api/harry/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: await request.text()
            });
        }

        // ── Serve static assets (with cache-busting for widget JS) ─────────
        const assetResponse = await env.ASSETS.fetch(request);
        if (url.pathname.includes('harry-widget.js')) {
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
