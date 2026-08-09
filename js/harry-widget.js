/**
 * ==========================================================================
 * 20/59 Ventures Corp - Harry (Telnyx Voice AI Assistant) Widget Engine
 * Assistant ID: assistant-a13e9614-4795-4962-b7e2-abdcba418c12
 * WebSocket URL: wss://api.telnyx.com/v2/ai/assistants/assistant-a13e9614-4795-4962-b7e2-abdcba418c12/conversation
 * ==========================================================================
 */

(function () {
    'use strict';

    const CONFIG = {
        assistantId: 'assistant-a13e9614-4795-4962-b7e2-abdcba418c12',
        wsUrl: 'wss://api.telnyx.com/v2/ai/assistants/assistant-a13e9614-4795-4962-b7e2-abdcba418c12/conversation',
        deskPhone: '+18889192059',
        targetSampleRate: 16000
    };

    // State Variables
    let ws = null;
    let audioCtx = null;
    let micStream = null;
    let scriptNode = null;
    let micSource = null;
    let isConnected = false;
    let isMuted = false;
    let isHarrySpeaking = false;
    let isUserSpeaking = false;
    let playbackQueue = [];
    let scheduledSources = [];
    let nextStartTime = 0;
    let currentAssistantBubble = null;
    let currentAssistantText = '';
    let visualizerAnimFrame = null;
    let audioLevel = 0;

    // Initialize UI on DOM Ready
    document.addEventListener('DOMContentLoaded', initWidgetUI);

    function initWidgetUI() {
        if (document.getElementById('harry-widget-launcher')) return;

        // Render Launcher Button
        const launcherHtml = `
            <div id="harry-widget-launcher" title="Talk to Harry - 20/59 Ventures Voice AI">
                <div class="harry-launcher-avatar">
                    <i class="fa-solid fa-headset"></i>
                </div>
                <div class="harry-launcher-text">
                    <span class="harry-launcher-title">Talk to Harry</span>
                    <span class="harry-launcher-sub">20/59 Voice AI Assistant</span>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', launcherHtml);

        // Render Voice Modal
        const modalHtml = `
            <div id="harry-widget-modal">
                <!-- Header -->
                <div class="harry-modal-header">
                    <div class="harry-header-info">
                        <div class="harry-avatar-wrapper">
                            <div class="harry-avatar">
                                <i class="fa-solid fa-user-astronaut"></i>
                            </div>
                            <div id="harry-status-dot" class="harry-status-dot"></div>
                        </div>
                        <div class="harry-header-details">
                            <span class="harry-name">Harry</span>
                            <span class="harry-role">Inbound Coordinator — 20/59 Ventures</span>
                            <span id="harry-status-badge" class="harry-status-badge">Offline</span>
                        </div>
                    </div>
                    <button id="harry-close-btn" class="harry-close-btn" title="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Canvas Visualizer -->
                <div class="harry-visualizer-container">
                    <canvas id="harry-audio-canvas"></canvas>
                    <span id="harry-visualizer-status" class="harry-visualizer-status">Click Start to Call Harry</span>
                </div>

                <!-- Transcript Window -->
                <div id="harry-transcript-container" class="harry-transcript-area">
                    <div class="harry-chat-msg assistant">
                        <div class="harry-chat-sender">Harry</div>
                        Hello! I'm Harry, the Inbound Coordinator for 20/59 Ventures. How can I assist you today with our veteran and senior housing services?
                    </div>
                </div>

                <!-- Lead Capture Drawer -->
                <div id="harry-lead-drawer" class="harry-lead-drawer">
                    <div class="harry-lead-title">
                        <span><i class="fa-solid fa-id-card"></i> Lead Capture Info</span>
                        <button id="harry-close-drawer-btn" style="background:none;border:none;cursor:pointer;color:#86868B;"><i class="fa-solid fa-chevron-down"></i></button>
                    </div>
                    <input type="text" id="harry-lead-name" class="harry-lead-input" placeholder="Full Name">
                    <input type="tel" id="harry-lead-phone" class="harry-lead-input" placeholder="Phone Number">
                    <input type="email" id="harry-lead-email" class="harry-lead-input" placeholder="Email Address">
                    <input type="text" id="harry-lead-inquiry" class="harry-lead-input" placeholder="Housing / Referral Inquiry">
                    <button id="harry-submit-lead-btn" class="harry-lead-submit">Submit Lead Details</button>
                </div>

                <!-- Toolbar Actions -->
                <div class="harry-control-bar">
                    <button id="harry-start-btn" class="harry-btn start-call-btn">
                        <i class="fa-solid fa-phone"></i> Start Voice Call
                    </button>
                    <button id="harry-mic-btn" class="harry-btn mic-btn" style="display:none;" title="Mute/Unmute Mic">
                        <i class="fa-solid fa-microphone"></i> Mic On
                    </button>
                    <button id="harry-bargein-btn" class="harry-btn bargein-btn" style="display:none;" title="Barge-in / Stop Harry">
                        <i class="fa-solid fa-hand"></i> Stop / Barge-in
                    </button>
                    <button id="harry-lead-btn" class="harry-btn" style="display:none;" title="Lead Capture Form">
                        <i class="fa-solid fa-user-plus"></i> Lead
                    </button>
                    <button id="harry-agent-btn" class="harry-btn agent-btn" style="display:none;" title="Transfer to Live Desk Phone">
                        <i class="fa-solid fa-headset"></i> Desk Phone
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Bind UI Events
        document.getElementById('harry-widget-launcher').addEventListener('click', toggleModal);
        document.getElementById('harry-close-btn').addEventListener('click', toggleModal);
        document.getElementById('harry-start-btn').addEventListener('click', handleStartStopCall);
        document.getElementById('harry-mic-btn').addEventListener('click', toggleMute);
        document.getElementById('harry-bargein-btn').addEventListener('click', triggerBargeIn);
        document.getElementById('harry-lead-btn').addEventListener('click', toggleLeadDrawer);
        document.getElementById('harry-close-drawer-btn').addEventListener('click', toggleLeadDrawer);
        document.getElementById('harry-submit-lead-btn').addEventListener('click', submitLeadForm);
        document.getElementById('harry-agent-btn').addEventListener('click', connectToDeskPhone);

        initCanvasVisualizer();
    }

    function toggleModal() {
        const modal = document.getElementById('harry-widget-modal');
        modal.classList.toggle('harry-active');
    }

    function toggleLeadDrawer() {
        const drawer = document.getElementById('harry-lead-drawer');
        drawer.classList.toggle('active');
    }

    function updateStatus(stateText, dotClass = '') {
        const badge = document.getElementById('harry-status-badge');
        const dot = document.getElementById('harry-status-dot');
        const vizText = document.getElementById('harry-visualizer-status');

        if (badge) badge.innerText = stateText;
        if (vizText) vizText.innerText = stateText;
        if (dot) {
            dot.className = 'harry-status-dot ' + dotClass;
        }
    }

    // =========================================================================
    // 1. Audio Recording & WebSocket Voice Engine
    // =========================================================================
    async function handleStartStopCall() {
        const startBtn = document.getElementById('harry-start-btn');
        const micBtn = document.getElementById('harry-mic-btn');
        const bargeBtn = document.getElementById('harry-bargein-btn');
        const leadBtn = document.getElementById('harry-lead-btn');
        const agentBtn = document.getElementById('harry-agent-btn');

        if (!isConnected) {
            startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting...';
            updateStatus('Connecting...', 'connecting');

            try {
                await initAudioContext();
                connectWebSocket();
                startBtn.innerHTML = '<i class="fa-solid fa-phone-slash"></i> End Voice Call';
                startBtn.style.background = '#FF3B30';
                micBtn.style.display = 'flex';
                bargeBtn.style.display = 'flex';
                leadBtn.style.display = 'flex';
                agentBtn.style.display = 'flex';
            } catch (err) {
                console.error('Audio/Mic init error:', err);
                alert('Microphone access is required to speak with Harry: ' + err.message);
                startBtn.innerHTML = '<i class="fa-solid fa-phone"></i> Start Voice Call';
                startBtn.style.background = '#4A7C59';
                updateStatus('Mic Error', '');
            }
        } else {
            disconnectCall();
            startBtn.innerHTML = '<i class="fa-solid fa-phone"></i> Start Voice Call';
            startBtn.style.background = '#4A7C59';
            micBtn.style.display = 'none';
            bargeBtn.style.display = 'none';
            leadBtn.style.display = 'none';
            agentBtn.style.display = 'none';
        }
    }

    async function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: CONFIG.targetSampleRate });
        }
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                channelCount: 1,
                sampleRate: CONFIG.targetSampleRate
            }
        });

        micSource = audioCtx.createMediaStreamSource(micStream);
        // Using ScriptProcessorNode for standard cross-browser PCM extraction
        scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);

        scriptNode.onaudioprocess = (e) => {
            if (!isConnected || isMuted) return;

            const inputData = e.inputBuffer.getChannelData(0);
            
            // Calculate audio level for visualizer
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
            }
            audioLevel = Math.sqrt(sum / inputData.length);

            // Convert Float32 array to PCM16 Int16Array
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            // Convert Int16Array to Base64
            const base64Audio = arrayBufferToBase64(pcm16.buffer);

            // Send Telnyx input_audio_buffer.append WS frame
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'input_audio_buffer.append',
                    audio: base64Audio
                }));
            }
        };

        micSource.connect(scriptNode);
        scriptNode.connect(audioCtx.destination);
    }

    let maxCallTimer = null;
    let silenceTimer15 = null;
    let silenceTimer30 = null;
    let silenceTimer45 = null;
    let zeroVolumeCounter = 0;
    const MAX_CALL_DURATION_MS = 300000; // 5 minutes max session cap for safety

    function resetSilenceTimers() {
        if (silenceTimer15) clearTimeout(silenceTimer15);
        if (silenceTimer30) clearTimeout(silenceTimer30);
        if (silenceTimer45) clearTimeout(silenceTimer45);

        if (!isConnected || isHarrySpeaking) return;

        // 15 Seconds Silence Check-in
        silenceTimer15 = setTimeout(() => {
            if (isConnected && !isHarrySpeaking && !isUserSpeaking) {
                appendSystemNotice('15s Silence: Are you still there? You can speak or click Desk Phone below.');
            }
        }, 15000);

        // 30 Seconds Silence Guidance
        silenceTimer30 = setTimeout(() => {
            if (isConnected && !isHarrySpeaking && !isUserSpeaking) {
                appendSystemNotice('30s Silence: Still here! Speak now or submit lead info in the Lead form.');
            }
        }, 30000);

        // 45 Seconds Silence Auto-Disconnect Guardrail
        silenceTimer45 = setTimeout(() => {
            if (isConnected && !isHarrySpeaking) {
                appendSystemNotice('45s Silence Limit: Call auto-disconnected to save API costs.');
                disconnectCall();
            }
        }, 45000);
    }

    function clearSilenceTimers() {
        if (silenceTimer15) clearTimeout(silenceTimer15);
        if (silenceTimer30) clearTimeout(silenceTimer30);
        if (silenceTimer45) clearTimeout(silenceTimer45);
    }

    function connectWebSocket() {
        ws = new WebSocket(CONFIG.wsUrl);

        ws.onopen = () => {
            isConnected = true;
            updateStatus('Connected & Listening', 'online');
            appendSystemNotice('Voice session connected to Harry. You can speak now!');

            resetSilenceTimers();

            // Guardrail: Set 5-minute max call session timer to prevent runaway API billing
            if (maxCallTimer) clearTimeout(maxCallTimer);
            maxCallTimer = setTimeout(() => {
                if (isConnected) {
                    appendSystemNotice('Maximum 5-minute session limit reached. Disconnecting call.');
                    alert('Session limit reached (5 mins). Call ended automatically to protect billing.');
                    disconnectCall();
                }
            }, MAX_CALL_DURATION_MS);
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                handleTelnyxEvent(msg);
            } catch (err) {
                console.error('Telnyx event parse error:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('Telnyx WebSocket error:', error);
            updateStatus('Connection Error', '');
        };

        ws.onclose = () => {
            isConnected = false;
            updateStatus('Call Ended', '');
            appendSystemNotice('Voice call ended.');
        };
    }

    function handleTelnyxEvent(msg) {
        const type = msg.type || msg.event;

        switch (type) {
            case 'session.created':
                updateStatus('Connected & Listening', 'online');
                break;

            case 'input_audio_buffer.speech_started':
                isUserSpeaking = true;
                resetSilenceTimers();
                updateStatus('User Speaking...', 'online');
                // Trigger auto barge-in if Harry is currently responding
                if (isHarrySpeaking) {
                    triggerBargeIn();
                }
                break;

            case 'input_audio_buffer.speech_stopped':
                isUserSpeaking = false;
                resetSilenceTimers();
                updateStatus('Harry is thinking...', 'connecting');
                break;

            case 'conversation.item.input_audio_transcription.completed':
                if (msg.transcript) {
                    appendUserTranscript(msg.transcript);
                }
                break;

            case 'response.created':
                isHarrySpeaking = true;
                clearSilenceTimers();
                updateStatus('Harry is speaking...', 'speaking');
                prepareAssistantBubble();
                break;

            case 'response.audio_transcript.delta':
            case 'response.text.delta':
                if (msg.delta) {
                    updateAssistantTranscript(msg.delta);
                }
                break;

            case 'response.output_audio.delta':
            case 'response.audio.delta':
                if (msg.delta) {
                    playPcm16Chunk(msg.delta);
                }
                break;

            case 'response.done':
                isHarrySpeaking = false;
                resetSilenceTimers();
                updateStatus('Listening...', 'online');
                currentAssistantBubble = null;
                currentAssistantText = '';
                break;

            default:
                break;
        }
    }

    // =========================================================================
    // 2. Real-Time PCM16 Playback & Queue Management
    // =========================================================================
    function playPcm16Chunk(base64Audio) {
        if (!audioCtx) return;

        const arrayBuffer = base64ToArrayBuffer(base64Audio);
        const int16Array = new Int16Array(arrayBuffer);
        const float32Array = new Float32Array(int16Array.length);

        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }

        const audioBuffer = audioCtx.createBuffer(1, float32Array.length, CONFIG.targetSampleRate);
        audioBuffer.getChannelData(0).set(float32Array);

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);

        const currentTime = audioCtx.currentTime;
        if (nextStartTime < currentTime) {
            nextStartTime = currentTime;
        }

        source.start(nextStartTime);
        nextStartTime += audioBuffer.duration;
        scheduledSources.push(source);

        source.onended = () => {
            const idx = scheduledSources.indexOf(source);
            if (idx > -1) scheduledSources.splice(idx, 1);
            if (scheduledSources.length === 0 && !isHarrySpeaking) {
                updateStatus('Listening...', 'online');
            }
        };
    }

    function triggerBargeIn() {
        // Stop all scheduled playback
        scheduledSources.forEach(src => {
            try { src.stop(); } catch (e) {}
        });
        scheduledSources = [];
        nextStartTime = 0;
        isHarrySpeaking = false;

        // Send Telnyx response.cancel WS frame
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'response.cancel' }));
        }

        updateStatus('Barge-in / Stopped', 'online');
    }

    function toggleMute() {
        isMuted = !isMuted;
        const micBtn = document.getElementById('harry-mic-btn');
        if (isMuted) {
            micBtn.classList.add('muted');
            micBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> Muted';
        } else {
            micBtn.classList.remove('muted');
            micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> Mic On';
        }
    }

    function disconnectCall() {
        clearSilenceTimers();
        if (maxCallTimer) {
            clearTimeout(maxCallTimer);
            maxCallTimer = null;
        }
        if (ws) {
            ws.close();
            ws = null;
        }
        if (micStream) {
            micStream.getTracks().forEach(t => t.stop());
            micStream = null;
        }
        if (scriptNode) {
            scriptNode.disconnect();
            scriptNode = null;
        }
        triggerBargeIn();
        
        // Auto-send call transcript email if user interacted during the call
        const transcriptContainer = document.getElementById('harry-transcript-container');
        if (transcriptContainer && isConnected) {
            const userMsgs = transcriptContainer.querySelectorAll('.harry-chat-msg.user');
            if (userMsgs.length > 0) {
                const callTranscript = transcriptContainer.innerText;
                sendEmailNotification({
                    name: 'Voice AI Web Visitor',
                    phone: 'Captured via Voice Session',
                    email: 'intake@2059ventures.online',
                    inquiry: 'Web Voice Session Call Log',
                    timestamp: new Date().toLocaleString(),
                    transcript: callTranscript
                });
            }
        }

        isConnected = false;
        updateStatus('Offline', '');
    }

    // =========================================================================
    // 3. Transcript UI Helpers
    // =========================================================================
    function appendUserTranscript(text) {
        const container = document.getElementById('harry-transcript-container');
        const msg = document.createElement('div');
        msg.className = 'harry-chat-msg user';
        msg.innerHTML = `<div class="harry-chat-sender">You</div>${escapeHtml(text)}`;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function prepareAssistantBubble() {
        const container = document.getElementById('harry-transcript-container');
        currentAssistantText = '';
        currentAssistantBubble = document.createElement('div');
        currentAssistantBubble.className = 'harry-chat-msg assistant';
        currentAssistantBubble.innerHTML = `<div class="harry-chat-sender">Harry</div><span class="harry-text-content">...</span>`;
        container.appendChild(currentAssistantBubble);
        container.scrollTop = container.scrollHeight;
    }

    function updateAssistantTranscript(deltaText) {
        if (!currentAssistantBubble) {
            prepareAssistantBubble();
        }
        currentAssistantText += deltaText;
        const textSpan = currentAssistantBubble.querySelector('.harry-text-content');
        if (textSpan) {
            textSpan.innerText = currentAssistantText;
        }
        const container = document.getElementById('harry-transcript-container');
        container.scrollTop = container.scrollHeight;
    }

    function appendSystemNotice(notice) {
        const container = document.getElementById('harry-transcript-container');
        const msg = document.createElement('div');
        msg.style.textAlign = 'center';
        msg.style.fontSize = '11px';
        msg.style.color = '#86868B';
        msg.style.margin = '4px 0';
        msg.innerText = notice;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    // =========================================================================
    // 4. Lead Capture & Direct Email Dispatch (intake@2059ventures.online)
    // =========================================================================
    function submitLeadForm() {
        const name = document.getElementById('harry-lead-name').value.trim();
        const phone = document.getElementById('harry-lead-phone').value.trim();
        const email = document.getElementById('harry-lead-email').value.trim();
        const inquiry = document.getElementById('harry-lead-inquiry').value.trim();

        if (!name || (!phone && !email)) {
            alert('Please provide your name and either a phone number or email address.');
            return;
        }

        // Get live conversation transcript history
        const transcriptContainer = document.getElementById('harry-transcript-container');
        const transcriptText = transcriptContainer ? transcriptContainer.innerText : '';

        const leadData = {
            name: name,
            phone: phone,
            email: email,
            inquiry: inquiry,
            timestamp: new Date().toLocaleString(),
            transcript: transcriptText
        };

        // 1. Inject as text turn into Telnyx assistant conversation if connected
        if (ws && ws.readyState === WebSocket.OPEN) {
            const leadPrompt = `User submitted lead details: Name: ${name}, Phone: ${phone}, Email: ${email}, Inquiry: ${inquiry}`;
            ws.send(JSON.stringify({
                type: 'conversation.item.create',
                item: {
                    type: 'message',
                    role: 'user',
                    content: [{ type: 'input_text', text: leadPrompt }]
                }
            }));
        }

        // 2. Dispatch Email directly to intake@2059ventures.online & support@2059ventures.online
        sendEmailNotification(leadData);

        appendSystemNotice(`Lead Submitted & Emailed: ${name} (${phone || email})`);
        toggleLeadDrawer();
        alert('Thank you! Your information has been captured and emailed directly to intake@2059ventures.online.');
    }

    function sendEmailNotification(leadData) {
        // Send email via FormSubmit AJAX to intake@2059ventures.online
        const formData = new FormData();
        formData.append('_subject', `[Harry Voice AI Lead] New Lead from ${leadData.name}`);
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('Name', leadData.name);
        formData.append('Phone', leadData.phone || 'N/A');
        formData.append('Email', leadData.email || 'N/A');
        formData.append('Inquiry', leadData.inquiry || 'Housing / Referral Inquiry');
        formData.append('Timestamp', leadData.timestamp);
        formData.append('Conversation_Transcript', leadData.transcript || 'No transcript text');

        // Post to intake@2059ventures.online
        fetch('https://formsubmit.co/ajax/intake@2059ventures.online', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Email dispatched to intake@2059ventures.online:', data);
        })
        .catch(err => {
            console.warn('Primary email dispatch notice:', err);
            // Fallback to Formspree endpoint existing on site
            fetch('https://formspree.io/f/meolndzb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(leadData)
            }).catch(e => console.error('Formspree fallback error:', e));
        });
    }

    function connectToDeskPhone() {
        appendSystemNotice('Transferring to 20/59 Ventures Live Desk Phone...');
        window.location.href = 'tel:' + CONFIG.deskPhone;
    }

    // =========================================================================
    // 5. Canvas Waveform Visualizer
    // =========================================================================
    function initCanvasVisualizer() {
        const canvas = document.getElementById('harry-audio-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let step = 0;

        function draw() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = isHarrySpeaking ? '#007AFF' : (isUserSpeaking ? '#34C759' : '#4A7C59');

            const amplitude = isHarrySpeaking || isUserSpeaking ? Math.max(15, audioLevel * 120) : 4;
            const frequency = 0.05;

            for (let x = 0; x < width; x++) {
                const y = centerY + Math.sin(x * frequency + step) * amplitude * Math.sin(x / width * Math.PI);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            step += 0.12;
            visualizerAnimFrame = requestAnimationFrame(draw);
        }

        draw();
    }

    // Utility Functions
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

})();
