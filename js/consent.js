/**
 * consent.js — 20/59 Ventures Corp cookie & tracker consent manager
 * Covers: Google Analytics 4, Microsoft Clarity, PostHog, LinkedIn Insight.
 * Necessary (security/load-balancing) is always on. Analytics + marketing
 * require opt-in and are denied by default (Google Consent Mode v2 pattern).
 */
(function () {
    'use strict';

    var KEY = 'consent-v1';
    var prefs = { necessary: true, analytics: false, marketing: false, ts: null };

    function load() {
        try {
            var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
            if (saved && typeof saved === 'object') prefs = saved;
        } catch (e) { /* storage unavailable: stay denied-by-default */ }
    }

    function save() {
        prefs.ts = new Date().toISOString();
        try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
    }

    function grantAnalytics() {
        try {
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    ad_storage: 'granted',
                    analytics_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                });
            }
        } catch (e) {}
        try {
            if (typeof window.__loadClarity === 'function') window.__loadClarity();
        } catch (e) {}
        try {
            if (window.posthog && typeof window.posthog.opt_in_capturing === 'function') {
                window.posthog.opt_in_capturing();
            }
        } catch (e) {}
    }

    function denyAnalytics() {
        try {
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    ad_storage: 'denied',
                    analytics_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied'
                });
            }
        } catch (e) {}
        try {
            if (window.posthog && typeof window.posthog.opt_out_capturing === 'function') {
                window.posthog.opt_out_capturing();
            }
        } catch (e) {}
        // Clarity has no opt-out API: it is only ever loaded after opt-in.
    }

    function apply(announce) {
        save();
        if (prefs.analytics) grantAnalytics(); else denyAnalytics();
        if (announce !== false) {
            try {
                document.dispatchEvent(new CustomEvent('consent-updated', { detail: prefs }));
            } catch (e) {}
        }
    }

    function buildBanner() {
        if (document.getElementById('consent-banner')) return;

        var bar = document.createElement('div');
        bar.id = 'consent-banner';
        bar.className = 'consent-banner';
        bar.setAttribute('role', 'dialog');
        bar.setAttribute('aria-live', 'polite');
        bar.setAttribute('aria-label', 'Cookie consent');
        bar.hidden = true;
        bar.innerHTML =
            '<div class="consent-inner">' +
            '<p class="consent-text"><strong>We value your privacy.</strong> ' +
            'We use necessary cookies to run this site, and — with your permission — analytics ' +
            '(Google Analytics, Microsoft Clarity, PostHog) and marketing cookies (LinkedIn) to ' +
            'improve services and measure outreach. See our <a href="cookie-policy.html">Cookie Policy</a>.</p>' +
            '<div class="consent-choices" hidden>' +
            '<label class="consent-toggle"><input type="checkbox" checked disabled> Necessary (always on)</label>' +
            '<label class="consent-toggle"><input type="checkbox" id="consent-analytics"> Analytics</label>' +
            '<label class="consent-toggle"><input type="checkbox" id="consent-marketing"> Marketing</label>' +
            '</div>' +
            '<div class="consent-actions">' +
            '<button type="button" class="consent-btn consent-accept">Accept all</button>' +
            '<button type="button" class="consent-btn consent-reject">Reject optional</button>' +
            '<button type="button" class="consent-btn consent-customize" aria-expanded="false">Customize</button>' +
            '<button type="button" class="consent-btn consent-save" hidden>Save choices</button>' +
            '</div></div>';

        document.body.appendChild(bar);

        var choices = bar.querySelector('.consent-choices');
        var customizeBtn = bar.querySelector('.consent-customize');
        var saveBtn = bar.querySelector('.consent-save');

        function syncBoxes() {
            var a = bar.querySelector('#consent-analytics');
            var m = bar.querySelector('#consent-marketing');
            if (a) a.checked = !!prefs.analytics;
            if (m) m.checked = !!prefs.marketing;
        }

        function open(customizing) {
            bar.hidden = false;
            syncBoxes();
            if (customizing) {
                choices.hidden = false;
                saveBtn.hidden = false;
                customizeBtn.setAttribute('aria-expanded', 'true');
            }
            var first = bar.querySelector('.consent-accept');
            if (first) first.focus();
        }

        function close() { bar.hidden = true; }

        bar.querySelector('.consent-accept').addEventListener('click', function () {
            prefs.analytics = true; prefs.marketing = true;
            apply(); close();
        });
        bar.querySelector('.consent-reject').addEventListener('click', function () {
            prefs.analytics = false; prefs.marketing = false;
            apply(); close();
        });
        customizeBtn.addEventListener('click', function () {
            var opening = choices.hidden;
            choices.hidden = !opening;
            saveBtn.hidden = !opening;
            customizeBtn.setAttribute('aria-expanded', opening ? 'true' : 'false');
        });
        saveBtn.addEventListener('click', function () {
            prefs.analytics = !!bar.querySelector('#consent-analytics').checked;
            prefs.marketing = !!bar.querySelector('#consent-marketing').checked;
            apply(); close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !bar.hidden) close();
        });

        document.querySelectorAll('[data-open-consent]').forEach(function (el) {
            el.addEventListener('click', function (ev) { ev.preventDefault(); open(true); });
        });

        window.__openConsentBanner = open;
        return open;
    }

    function init() {
        load();
        var open = buildBanner();
        // Apply stored prefs to tracker APIs on every page load.
        apply(false);
        try {
            if (!localStorage.getItem(KEY) && open) open(false);
        } catch (e) {
            if (open) open(false);
        }
    }

    window.__consent = {
        get: function () { return prefs; },
        apply: apply,
        open: function () {
            if (typeof window.__openConsentBanner === 'function') window.__openConsentBanner(true);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
