/**
 * linkedin-tracker.js — 20/59 Ventures LinkedIn Conversions & Attribution Tracker
 * 
 * 1. Captures LinkedIn ad click ID (li_fat_id) from URL and stores in first-party storage.
 * 2. Dispatches server-side conversion events via Cloudflare Worker CAPI endpoint.
 * 3. Supports LinkedIn Insight Tag for building retargeting audiences at $0 cost.
 */

(function () {
    'use strict';

    // ── 1. Capture & Persist LinkedIn Click ID (li_fat_id) ──────────────────
    function initLinkedInTracking() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const liFatId = urlParams.get('li_fat_id');
            if (liFatId) {
                localStorage.setItem('2059_li_fat_id', liFatId);
                const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
                document.cookie = `li_fat_id=${encodeURIComponent(liFatId)}; expires=${expires}; path=/; SameSite=Lax`;
            }
        } catch (e) {
            console.warn('[LinkedIn Tracker] Storage access restricted:', e);
        }

        // Initialize LinkedIn Insight Tag loader
        initLinkedInInsightTag();
    }

    // ── 2. LinkedIn Insight Tag Audience Builder ─────────────────────────────
    function initLinkedInInsightTag() {
        if (window._linkedin_partner_id) {
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(window._linkedin_partner_id);

            if (!document.getElementById('linkedin-insight-script')) {
                const s = document.getElementsByTagName('script')[0];
                const b = document.createElement('script');
                b.id = 'linkedin-insight-script';
                b.type = 'text/javascript';
                b.async = true;
                b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
                s.parentNode.insertBefore(b, s);
            }
        }
    }

    // ── 3. Retrieve Stored Click ID ──────────────────────────────────────────
    function getLiFatId() {
        try {
            const fromStorage = localStorage.getItem('2059_li_fat_id');
            if (fromStorage) return fromStorage;

            const match = document.cookie.match(/(?:^|; )li_fat_id=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : null;
        } catch (e) {
            return null;
        }
    }

    // ── 4. Dispatch Conversion to Cloudflare Worker CAPI ───────────────────
    async function trackLinkedInConversion(eventName, userData = {}) {
        try {
            const liFatId = getLiFatId();
            const payload = {
                eventName: eventName || 'Lead',
                timestamp: Date.now(),
                url: window.location.href,
                liFatId: liFatId,
                email: userData.email || '',
                phone: userData.phone || '',
                name: userData.name || '',
                company: userData.company || '',
                conversionValue: userData.value || '0.00'
            };

            const response = await fetch('/api/linkedin-conversion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();
            console.log('[LinkedIn Tracker] Conversion dispatch result:', resData);
            return resData;
        } catch (err) {
            console.error('[LinkedIn Tracker] Conversion dispatch error:', err);
            return { error: err.message };
        }
    }

    // Export globally
    window.trackLinkedInConversion = trackLinkedInConversion;
    window.getLiFatId = getLiFatId;
    window.initLinkedInInsightTag = initLinkedInInsightTag;

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLinkedInTracking);
    } else {
        initLinkedInTracking();
    }
})();
