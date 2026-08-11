/**
 * Cloudflare Pages Function: /api/chat
 * Securely proxies Harry AI Chat requests to the Telnyx Assistant API
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const body = await request.json();
        const { content, conversationId, assistantId } = body;

        const targetAssistantId = assistantId || 'assistant-a13e9614-4795-4962-b7e2-abdcba418c12';
        const apiKey = env.TELNYX_API_KEY;

        if (!content) {
            return new Response(JSON.stringify({ error: 'Content is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        let activeConvId = conversationId;

        // 1. Create a conversation on Telnyx if none provided
        if (!activeConvId || activeConvId === 'new') {
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
            }
        }

        // 2. Chat with Telnyx Assistant API
        let chatRes = await fetch(`https://api.telnyx.com/v2/ai/assistants/${targetAssistantId}/chat`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content,
                conversation_id: activeConvId
            })
        });

        // 3. Fallback: If conversation ID was invalid/expired, create new one and retry
        if (!chatRes.ok && chatRes.status === 404) {
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
                chatRes = await fetch(`https://api.telnyx.com/v2/ai/assistants/${targetAssistantId}/chat`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: content,
                        conversation_id: activeConvId
                    })
                });
            }
        }

        if (!chatRes.ok) {
            const errText = await chatRes.text();
            console.error('Telnyx Chat Error:', chatRes.status, errText);
            return new Response(JSON.stringify({
                error: `Telnyx Error ${chatRes.status}`,
                content: "I'm having a brief connection issue. Please feel free to use the Lead Form below or call our desk phone directly!"
            }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const chatData = await chatRes.json();
        const replyText = chatData.data?.content || chatData.content || "Thank you for reaching out!";

        return new Response(JSON.stringify({
            content: replyText,
            conversationId: activeConvId,
            success: true
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Chat function error:', err);
        return new Response(JSON.stringify({
            error: err.message,
            content: "An error occurred. Please try again or reach out to our team via the Lead Form."
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
