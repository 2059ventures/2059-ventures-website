/**
 * 20 59 Ventures Corp - Secure Inbound Fax Display System
 * 
 * Prevents automated web scrapers, cold-call crawlers, and junk fax bots from
 * harvesting toll-free fax numbers from raw HTML source code.
 * 
 * Features:
 * - Anti-scraping obfuscation: No raw digits in HTML source
 * - Dynamic segment reconstruction upon user click
 * - 1-click copy-to-clipboard with visual confirmation
 * - Branded "Spam Shielded" indicator badge
 * - Synchronized revelation across all page widgets
 * - Full WCAG / ADA accessibility with ARIA live region support
 */
(function () {
    'use strict';

    // Obfuscated character codes for 1-888-885-2059 (prevents plain-text / regex bot scraping)
    // 49='1', 45='-', 56='8', 53='5', 50='2', 48='0', 57='9'
    var _CHAR_CODES = [49, 45, 56, 56, 56, 45, 56, 56, 53, 45, 50, 48, 53, 57];
    var _REVEALED_STATE = false;

    function getFormattedFax() {
        return _CHAR_CODES.map(function (c) {
            return String.fromCharCode(c);
        }).join('');
    }

    /**
     * Copies text to clipboard with fallback
     */
    async function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Legacy / HTTP fallback
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise(function (resolve, reject) {
                var successful = false;
                try {
                    successful = document.execCommand('copy');
                } catch (err) {
                    successful = false;
                }
                document.body.removeChild(textArea);
                if (successful) {
                    resolve();
                } else {
                    reject(new Error('Copy command failed'));
                }
            });
        }
    }

    /**
     * Reveals the fax number across all secure fax elements on the current page
     */
    function revealAllFaxNumbers() {
        _REVEALED_STATE = true;
        var faxNum = getFormattedFax();

        document.querySelectorAll('.print-fax-text').forEach(function(el) { el.textContent = getFormattedFax() + ' (T.38/PDF)'; });
        var widgets = document.querySelectorAll('.secure-fax-card, .secure-fax-inline, .secure-fax-widget, .sheet-contact-fax');
        widgets.forEach(function (widget) {
            var revealBtn = widget.querySelector('.secure-fax-reveal-btn');
            var revealedBox = widget.querySelector('.secure-fax-revealed');
            var numberSpan = widget.querySelector('.secure-fax-number');

            if (numberSpan) {
                numberSpan.textContent = faxNum;
            }
            if (revealBtn) {
                revealBtn.style.display = 'none';
            }
            if (revealedBox) {
                revealedBox.style.display = 'inline-flex';
                revealedBox.setAttribute('aria-hidden', 'false');
            }
        });

        // Announce to screen readers
        var announcers = document.querySelectorAll('.secure-fax-sr-status');
        announcers.forEach(function (el) {
            el.textContent = 'Official inbound fax revealed: ' + faxNum;
        });
    }

    /**
     * Initializes a single secure fax widget
     */
    function initWidget(widget) {
        if (widget.getAttribute('data-fax-initialized') === 'true') return;
        widget.setAttribute('data-fax-initialized', 'true');

        var revealBtn = widget.querySelector('.secure-fax-reveal-btn');
        var copyBtn = widget.querySelector('.secure-fax-copy-btn');
        var srStatus = widget.querySelector('.secure-fax-sr-status');

        if (revealBtn) {
            revealBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                revealAllFaxNumbers();
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', async function (e) {
                e.preventDefault();
                e.stopPropagation();
                var num = getFormattedFax();

                try {
                    await copyToClipboard(num);
                    var originalHtml = copyBtn.innerHTML;
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = '<i class="fas fa-check" style="color: #10b981;" aria-hidden="true"></i> <span style="color: #10b981; font-weight: 600;">Copied!</span>';
                    copyBtn.setAttribute('title', 'Copied to clipboard');

                    if (srStatus) {
                        srStatus.textContent = 'Fax number ' + num + ' copied to clipboard.';
                    }

                    setTimeout(function () {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = originalHtml;
                        copyBtn.setAttribute('title', 'Copy fax number to clipboard');
                    }, 2500);
                } catch (err) {
                    console.error('Failed to copy fax number:', err);
                }
            });
        }

        // If another widget already revealed the number on this page, immediately sync this one
        if (_REVEALED_STATE) {
            var numberSpan = widget.querySelector('.secure-fax-number');
            var revealedBox = widget.querySelector('.secure-fax-revealed');
            if (numberSpan) numberSpan.textContent = getFormattedFax();
            if (revealBtn) revealBtn.style.display = 'none';
            if (revealedBox) {
                revealedBox.style.display = 'inline-flex';
                revealedBox.setAttribute('aria-hidden', 'false');
            }
        }
    }

    /**
     * Auto-renders container if placeholder markup is requested
     */
    function renderPlaceholderWidgets() {
        var autoContainers = document.querySelectorAll('.secure-fax-embed');
        autoContainers.forEach(function (container) {
            if (container.getAttribute('data-rendered') === 'true') return;
            container.setAttribute('data-rendered', 'true');

            var isDark = container.getAttribute('data-dark') === 'true';
            var customClass = container.getAttribute('data-class') || '';
            var label = container.getAttribute('data-label') || 'Official Agency Records & Casework Inbound Fax (T.38 / PDF)';
            var subtext = container.getAttribute('data-subtext') || 'Direct electronic PDF delivery for 20/59 Ventures agency forms & casework records.';
            var compact = container.getAttribute('data-compact') === 'true';

            var card = document.createElement('div');
            card.className = 'secure-fax-card ' + (isDark ? 'dark-theme ' : '') + (compact ? 'compact-theme ' : '') + customClass;
            card.innerHTML = [
                '<div class="secure-fax-header">',
                '  <div class="secure-fax-label">',
                '    <i class="fas fa-file-contract" aria-hidden="true"></i>',
                '    <span>' + label + '</span>',
                '  </div>',
                '  <span class="secure-fax-badge">',
                '    <i class="fas fa-shield-alt" aria-hidden="true"></i> Spam Shielded',
                '  </span>',
                '</div>',
                '<div class="secure-fax-body">',
                '  <button type="button" class="secure-fax-reveal-btn" aria-label="Click to reveal toll-free inbound fax number">',
                '    <i class="fas fa-eye" aria-hidden="true"></i>',
                '    <span>Click to View Fax</span>',
                '  </button>',
                '  <div class="secure-fax-revealed" style="display: none;" aria-hidden="true">',
                '    <span class="secure-fax-number" aria-label="Toll-free inbound fax number"></span>',
                '    <button type="button" class="secure-fax-copy-btn" aria-label="Copy fax number to clipboard" title="Copy to clipboard">',
                '      <i class="far fa-copy" aria-hidden="true"></i>',
                '      <span>Copy</span>',
                '    </button>',
                '  </div>',
                '  <span class="sr-only secure-fax-sr-status" aria-live="polite"></span>',
                '</div>',
                '<p class="secure-fax-subtext">' + subtext + '</p>'
            ].join('\n');

            container.innerHTML = '';
            container.appendChild(card);
            initWidget(card);
        });
    }

    /**
     * Initializes all widgets on DOM ready
     */
    function initAll() {
        renderPlaceholderWidgets();
        document.querySelectorAll('.print-fax-text').forEach(function(el) { el.textContent = getFormattedFax() + ' (T.38/PDF)'; });
        var widgets = document.querySelectorAll('.secure-fax-card, .secure-fax-inline, .secure-fax-widget, .sheet-contact-fax');
        widgets.forEach(initWidget);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Expose global methods
    window.initSecureFaxWidgets = initAll;
    window.revealSecureFax = revealAllFaxNumbers;
    window.getSecureFaxNumber = getFormattedFax;
})();
