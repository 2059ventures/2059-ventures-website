// 20/59 Ventures - Apple-Style JavaScript
// Smooth animations, interactions, and form handling

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initAppleAnimations();
    initModals();
    initFormHandling();
    initSmoothScrolling();
    initScrollEffects();
    initTouchSupport();
    enhancedFormSubmission();
    
    console.log('20/59 Ventures Apple-style website initialized');
});

// Navigation functionality with Apple-style behavior
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', debouncedHighlight);
}

// Apple-style smooth animations and intersection observer
function initAppleAnimations() {
    // Optimized Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger animations for cards
                const cards = entry.target.parentElement?.querySelectorAll('.feature-card, .about-card, .tech-card, .community-card, .guarantee-card, .disclosure-item');
                if (cards && cards.length > 1) {
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 100);
                    });
                }
                
                // Stop observing once animated for better performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.fade-in, .feature-card, .about-card, .tech-card, .community-card, .guarantee-card, .service-item, .disclosure-item').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section (subtle, Apple-like)
    const hero = document.querySelector('.hero');
    if (hero) {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Apple-style hover effects for cards
    const cards = document.querySelectorAll('.feature-card, .about-card, .tech-card, .community-card, .guarantee-card, .housing-card, .contact-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 60px rgba(74, 124, 89, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Enhanced touch support for mobile devices
function initTouchSupport() {
    // Add touch feedback for interactive elements
    const touchElements = document.querySelectorAll('.btn-primary, .btn-secondary, .feature-card, .about-card, .tech-card, .community-card, .guarantee-card, .housing-card');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = '';
            }, 150);
        }, { passive: true });
    });
    
    // Prevent zoom on double tap for buttons
    const preventZoomElements = document.querySelectorAll('.btn-primary, .btn-secondary');
    preventZoomElements.forEach(element => {
        element.addEventListener('touchend', function(event) {
            event.preventDefault();
            this.click();
        });
    });
}

// Highlight active navigation link
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Modal functionality with Apple-style animations
function initModals() {
    document.addEventListener('click', function(event) {
        // Handle modal close clicks
        if (event.target.classList.contains('modal') || event.target.classList.contains('close')) {
            const modal = event.target.closest('.modal') || event.target.parentElement.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

// Open modal with Apple-style animation
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        
        // Apple-style modal animation
        requestAnimationFrame(() => {
            modal.style.transition = 'opacity 0.3s ease, backdrop-filter 0.3s ease';
            modal.style.opacity = '1';
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(20px) scale(0.95)';
                modalContent.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                requestAnimationFrame(() => {
                    modalContent.style.transform = 'translateY(0) scale(1)';
                });
            }
        });
        
        // Focus management for accessibility
        const firstInput = modal.querySelector('input, textarea, select, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        console.log(`Modal opened: ${modalId}`);
    }
}

// Close modal with Apple-style animation
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        
        // Apple-style close animation
        if (modalContent) {
            modalContent.style.transform = 'translateY(20px) scale(0.95)';
        }
        
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('show');
            modal.style.transition = '';
            if (modalContent) {
                modalContent.style.transform = '';
                modalContent.style.transition = '';
            }
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clear form errors
        clearFormErrors(modal);
        
        console.log(`Modal closed: ${modalId}`);
    }
}

// Enhanced form handling with Apple-style feedback
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation with Apple-style feedback
        form.addEventListener('input', function(event) {
            validateFieldAppleStyle(event.target);
        });
        
        // Apple-style focus effects for form elements
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.parentElement.style.transition = 'transform 0.3s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
    });
}

// Enhanced form submission with better error handling
function enhancedFormSubmission() {
    const forms = document.querySelectorAll('form[action*="formspree.io"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            if (!validateForm(form)) {
                showAppleStyleNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            showAppleFormLoading(form);
            
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    handleFormSuccess(form);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showAppleStyleNotification('Sorry, there was an error sending your message. Please try again.', 'error');
                clearFormErrors(form.closest('.modal') || document);
            }
        });
    });
    
    // Handle regular forms without Formspree
    const regularForms = document.querySelectorAll('form:not([action*="formspree.io"])');
    regularForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(form)) {
                event.preventDefault();
                showAppleStyleNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show Apple-style loading state
            showAppleFormLoading(form);
            
            console.log(`Form submitted: ${form.action}`);
        });
    });
}

// Apple-style field validation
function validateFieldAppleStyle(field) {
    const fieldGroup = field.closest('.form-group');
    if (!fieldGroup) return true;
    
    // Remove existing styling
    field.style.borderColor = '';
    field.style.boxShadow = '';
    const existingError = fieldGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        // Apple-style error styling
        field.style.borderColor = '#FF3B30';
        field.style.boxShadow = '0 0 0 3px rgba(255, 59, 48, 0.1)';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = errorMessage;
        errorElement.style.cssText = `
            color: #FF3B30;
            font-size: 14px;
            margin-top: 6px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        
        fieldGroup.appendChild(errorElement);
        
        // Apple-style error animation
        requestAnimationFrame(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        });
    } else if (field.value.trim()) {
        // Apple-style success styling
        field.style.borderColor = '#4A7C59';
        field.style.boxShadow = '0 0 0 3px rgba(74, 124, 89, 0.1)';
    }
    
    return isValid;
}

// Validate entire form
function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateFieldAppleStyle(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Apple-style form loading state
function showAppleFormLoading(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.6';
        submitButton.style.transform = 'scale(0.98)';
        
        const originalText = submitButton.textContent;
        submitButton.dataset.originalText = originalText;
        
        // Apple-style loading animation
        submitButton.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                Sending...
            </div>
        `;
        
        // Add loading animation CSS
        if (!document.querySelector('#loading-animation-css')) {
            const style = document.createElement('style');
            style.id = 'loading-animation-css';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Clear form errors with Apple-style animations
function clearFormErrors(container) {
    const errors = container.querySelectorAll('.field-error');
    errors.forEach(error => {
        error.style.opacity = '0';
        error.style.transform = 'translateY(-10px)';
        setTimeout(() => error.remove(), 300);
    });
    
    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
    
    // Reset submit buttons
    const submitButtons = container.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.disabled = false;
        button.style.opacity = '';
        button.style.transform = '';
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    });
}

// Apple-style notifications
function showAppleStyleNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.apple-notification');
    existingNotifications.forEach(notification => {
        notification.style.transform = 'translateY(-100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });

    const notification = document.createElement('div');
    notification.className = 'apple-notification';
    notification.textContent = message;
    
    const colors = {
        success: { bg: '#4A7C59', color: 'white' },
        error: { bg: '#FF3B30', color: 'white' },
        warning: { bg: '#FF9F0A', color: 'white' },
        info: { bg: '#007AFF', color: 'white' }
    };
    
    const colorScheme = colors[type] || colors.success;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: ${colorScheme.bg};
        color: ${colorScheme.color};
        padding: 16px 32px;
        border-radius: 25px;
        font-weight: 500;
        font-size: 16px;
        z-index: 3000;
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        max-width: 90%;
        text-align: center;
        cursor: pointer;
    `;
    
    document.body.appendChild(notification);
    
    // Apple-style entrance animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
        notification.style.opacity = '1';
    });
    
    // Auto-remove with Apple-style exit animation
    const autoRemoveTimeout = setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(-100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        clearTimeout(autoRemoveTimeout);
        this.style.transform = 'translateX(-50%) translateY(-100px)';
        this.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
            }
        }, 300);
    });
}

// Apple-style smooth scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.nav');
                const navbarHeight = navbar ? navbar.offsetHeight : 60;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                // Apple-style smooth scroll with easing
                smoothScrollTo(targetPosition, 800);
            }
        });
    });
}

// Custom smooth scroll function with Apple-style easing
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    const startTime = performance.now();

    function scroll(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Apple-style easing function
        const ease = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, start + distance * ease);
        
        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }
    
    requestAnimationFrame(scroll);
}

// Apple-style scroll effects
function initScrollEffects() {
    const navbar = document.querySelector('.nav');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset;
        
        // Navbar background and blur effect
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(248, 246, 240, 0.95)';
            navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
            navbar.style.borderBottomColor = 'rgba(74, 124, 89, 0.15)';
        } else {
            navbar.style.background = 'rgba(248, 246, 240, 0.8)';
            navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
            navbar.style.borderBottomColor = 'rgba(74, 124, 89, 0.1)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Create Apple-style scroll-to-top button
    createAppleScrollToTop();
}

// Apple-style scroll-to-top button
function createAppleScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'apple-scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: rgba(74, 124, 89, 0.9);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-size: 18px;
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.8);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide with Apple-style animation
    let scrollTicking = false;
    
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                if (window.pageYOffset > 500) {
                    scrollBtn.style.opacity = '1';
                    scrollBtn.style.visibility = 'visible';
                    scrollBtn.style.transform = 'translateY(0) scale(1)';
                } else {
                    scrollBtn.style.opacity = '0';
                    scrollBtn.style.visibility = 'hidden';
                    scrollBtn.style.transform = 'translateY(20px) scale(0.8)';
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
    
    // Scroll to top with smooth animation
    scrollBtn.addEventListener('click', function() {
        smoothScrollTo(0, 800);
    });
    
    // Apple-style hover effects
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(58, 95, 71, 0.9)';
        this.style.transform = 'translateY(0) scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(74, 124, 89, 0.9)';
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// Form success handling (for Formspree integration)
function handleFormSuccess(form) {
    form.reset();
    clearFormErrors(form.closest('.modal') || document);
    showAppleStyleNotification('Thank you! Your message has been sent successfully.', 'success');
    
    const modal = form.closest('.modal');
    if (modal) {
        setTimeout(() => closeModal(modal.id), 1500);
    }
    
    console.log('Form submitted successfully:', form.action);
}

// Enhanced accessibility
function initAccessibility() {
    // Skip to main content link with Apple styling
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -50px;
        left: 20px;
        background: #4A7C59;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 8px;
        z-index: 3000;
        font-weight: 500;
        transition: top 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '20px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-50px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main id to hero section
    const hero = document.querySelector('.hero');
    if (hero && !hero.id) {
        hero.setAttribute('id', 'main');
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Cleanup function for better memory management
function cleanup() {
    // Remove event listeners on page unload
    window.removeEventListener('scroll', debouncedHighlight);
    
    // Clean up any remaining animations
    const animations = document.querySelectorAll('[style*="transition"]');
    animations.forEach(element => {
        element.style.transition = '';
    });
    
    // Clear any remaining timeouts
    const notifications = document.querySelectorAll('.apple-notification');
    notifications.forEach(notification => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    });
}

// Initialize accessibility features
initAccessibility();

// Handle online/offline status with Apple-style notifications
window.addEventListener('online', function() {
    showAppleStyleNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showAppleStyleNotification('You appear to be offline', 'warning');
});

// Apply debouncing to scroll-heavy functions
const debouncedHighlight = debounce(highlightActiveNavLink, 10);

// Export functions for HTML onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;

// Enhanced error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    showAppleStyleNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause any animations when page is not visible
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
});

// Enhanced form validation for specific fields
function addCustomValidation() {
    // Custom validation for specific form fields
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Format phone number as user types
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
            this.value = value;
        });
    });
    
    // Email field enhancements
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            this.value = this.value.toLowerCase().trim();
        });
    });
}

// Initialize custom validation
addCustomValidation();

console.log('20/59 Ventures - Apple-style JavaScript fully loaded');
