   1	// 20/59 Ventures - Apple-Style JavaScript
     2	// Smooth animations, interactions, and form handling
     3	
     4	document.addEventListener('DOMContentLoaded', function() {
     5	    // Initialize all functionality
     6	    initNavigation();
     7	    initAppleAnimations();
     8	    initModals();
     9	    initFormHandling();
    10	    initSmoothScrolling();
    11	    initScrollEffects();
    12	    
    13	    console.log('20/59 Ventures Apple-style website initialized');
    14	});
    15	
    16	// Navigation functionality with Apple-style behavior
    17	function initNavigation() {
    18	    const navToggle = document.getElementById('nav-toggle');
    19	    const navMenu = document.querySelector('.nav-links');
    20	    const navLinks = document.querySelectorAll('.nav-link');
    21	    
    22	    // Mobile menu toggle
    23	    if (navToggle && navMenu) {
    24	        navToggle.addEventListener('click', function() {
    25	            navToggle.classList.toggle('active');
    26	            navMenu.classList.toggle('active');
    27	            
    28	            // Prevent body scroll when menu is open
    29	            if (navMenu.classList.contains('active')) {
    30	                document.body.style.overflow = 'hidden';
    31	            } else {
    32	                document.body.style.overflow = '';
    33	            }
    34	        });
    35	    }
    36	    
    37	    // Close mobile menu when clicking on links
    38	    navLinks.forEach(link => {
    39	        link.addEventListener('click', function() {
    40	            if (navMenu && navMenu.classList.contains('active')) {
    41	                navToggle.classList.remove('active');
    42	                navMenu.classList.remove('active');
    43	                document.body.style.overflow = '';
    44	            }
    45	        });
    46	    });
    47	    
    48	    // Close mobile menu when clicking outside
    49	    document.addEventListener('click', function(event) {
    50	        if (navMenu && navMenu.classList.contains('active')) {
    51	            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
    52	                navToggle.classList.remove('active');
    53	                navMenu.classList.remove('active');
    54	                document.body.style.overflow = '';
    55	            }
    56	        }
    57	    });
    58	    
    59	    // Active navigation highlighting
    60	    window.addEventListener('scroll', highlightActiveNavLink);
    61	}
    62	
    63	// Apple-style smooth animations and intersection observer
    64	function initAppleAnimations() {
    65	    // Intersection Observer for fade-in animations
    66	    const observerOptions = {
    67	        threshold: 0.1,
    68	        rootMargin: '0px 0px -100px 0px'
    69	    };
    70	
    71	    const observer = new IntersectionObserver((entries) => {
    72	        entries.forEach(entry => {
    73	            if (entry.isIntersecting) {
    74	                entry.target.classList.add('fade-in');
    75	                // Stagger animations for cards
    76	                const cards = entry.target.parentElement?.querySelectorAll('.feature-card, .about-card, .tech-card, .community-card, .guarantee-card, .disclosure-item');
    77	                if (cards && cards.length > 1) {
    78	                    cards.forEach((card, index) => {
    79	                        setTimeout(() => {
    80	                            card.classList.add('fade-in');
    81	                        }, index * 100);
    82	                    });
    83	                }
    84	            }
    85	        });
    86	    }, observerOptions);
    87	
    88	    // Observe all animatable elements
    89	    document.querySelectorAll('.fade-in, .feature-card, .about-card, .tech-card, .community-card, .guarantee-card, .service-item, .disclosure-item').forEach(el => {
    90	        observer.observe(el);
    91	    });
    92	
    93	    // Parallax effect for hero section (subtle, Apple-like)
    94	    const hero = document.querySelector('.hero');
    95	    if (hero) {
    96	        window.addEventListener('scroll', () => {
    97	            const scrolled = window.pageYOffset;
    98	            const rate = scrolled * -0.3;
    99	            hero.style.transform = `translateY(${rate}px)`;
   100	        });
   101	    }
   102	
   103	    // Apple-style hover effects for cards
   104	    const cards = document.querySelectorAll('.feature-card, .about-card, .tech-card, .community-card, .guarantee-card, .housing-card, .contact-item');
   105	    cards.forEach(card => {
   106	        card.addEventListener('mouseenter', function() {
   107	            this.style.transform = 'translateY(-8px) scale(1.02)';
   108	            this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
   109	        });
   110	        
   111	        card.addEventListener('mouseleave', function() {
   112	            this.style.transform = 'translateY(0) scale(1)';
   113	            this.style.boxShadow = '';
   114	        });
   115	    });
   116	
   117	    // Button hover effects
   118	    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
   119	    buttons.forEach(button => {
   120	        button.addEventListener('mouseenter', function() {
   121	            this.style.transform = 'translateY(-2px) scale(1.05)';
   122	        });
   123	        
   124	        button.addEventListener('mouseleave', function() {
   125	            this.style.transform = 'translateY(0) scale(1)';
   126	        });
   127	    });
   128	}
   129	
   130	// Highlight active navigation link
   131	function highlightActiveNavLink() {
   132	    const sections = document.querySelectorAll('section[id]');
   133	    const navLinks = document.querySelectorAll('.nav-link');
   134	    const scrollPosition = window.scrollY + 100;
   135	    
   136	    sections.forEach(section => {
   137	        const sectionTop = section.offsetTop;
   138	        const sectionHeight = section.offsetHeight;
   139	        const sectionId = section.getAttribute('id');
   140	        
   141	        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
   142	            navLinks.forEach(link => {
   143	                link.classList.remove('active');
   144	                if (link.getAttribute('href') === `#${sectionId}`) {
   145	                    link.classList.add('active');
   146	                }
   147	            });
   148	        }
   149	    });
   150	}
   151	
   152	// Modal functionality with Apple-style animations
   153	function initModals() {
   154	    document.addEventListener('click', function(event) {
   155	        // Handle modal close clicks
   156	        if (event.target.classList.contains('modal') || event.target.classList.contains('close')) {
   157	            const modal = event.target.closest('.modal') || event.target.parentElement.closest('.modal');
   158	            if (modal) {
   159	                closeModal(modal.id);
   160	            }
   161	        }
   162	    });
   163	    
   164	    // Close modals with Escape key
   165	    document.addEventListener('keydown', function(event) {
   166	        if (event.key === 'Escape') {
   167	            const openModals = document.querySelectorAll('.modal[style*="block"]');
   168	            openModals.forEach(modal => {
   169	                closeModal(modal.id);
   170	            });
   171	        }
   172	    });
   173	}
   174	
   175	// Open modal with Apple-style animation
   176	function openModal(modalId) {
   177	    const modal = document.getElementById(modalId);
   178	    if (modal) {
   179	        modal.style.display = 'block';
   180	        modal.style.opacity = '0';
   181	        
   182	        // Apple-style modal animation
   183	        requestAnimationFrame(() => {
   184	            modal.style.transition = 'opacity 0.3s ease, backdrop-filter 0.3s ease';
   185	            modal.style.opacity = '1';
   186	            
   187	            const modalContent = modal.querySelector('.modal-content');
   188	            if (modalContent) {
   189	                modalContent.style.transform = 'translateY(20px) scale(0.95)';
   190	                modalContent.style.transition = 'transform 0.3s ease';
   191	                
   192	                requestAnimationFrame(() => {
   193	                    modalContent.style.transform = 'translateY(0) scale(1)';
   194	                });
   195	            }
   196	        });
   197	        
   198	        // Focus management for accessibility
   199	        const firstInput = modal.querySelector('input, textarea, select, button');
   200	        if (firstInput) {
   201	            setTimeout(() => firstInput.focus(), 300);
   202	        }
   203	        
   204	        // Prevent body scroll
   205	        document.body.style.overflow = 'hidden';
   206	        
   207	        console.log(`Modal opened: ${modalId}`);
   208	    }
   209	}
   210	
   211	// Close modal with Apple-style animation
   212	function closeModal(modalId) {
   213	    const modal = document.getElementById(modalId);
   214	    if (modal) {
   215	        const modalContent = modal.querySelector('.modal-content');
   216	        
   217	        // Apple-style close animation
   218	        if (modalContent) {
   219	            modalContent.style.transform = 'translateY(20px) scale(0.95)';
   220	        }
   221	        
   222	        modal.style.opacity = '0';
   223	        
   224	        setTimeout(() => {
   225	            modal.style.display = 'none';
   226	            modal.style.transition = '';
   227	            if (modalContent) {
   228	                modalContent.style.transform = '';
   229	                modalContent.style.transition = '';
   230	            }
   231	        }, 300);
   232	        
   233	        // Restore body scroll
   234	        document.body.style.overflow = '';
   235	        
   236	        // Clear form errors
   237	        clearFormErrors(modal);
   238	        
   239	        console.log(`Modal closed: ${modalId}`);
   240	    }
   241	}
   242	
   243	// Enhanced form handling with Apple-style feedback
   244	function initFormHandling() {
   245	    const forms = document.querySelectorAll('form');
   246	    
   247	    forms.forEach(form => {
   248	        // Real-time validation with Apple-style feedback
   249	        form.addEventListener('input', function(event) {
   250	            validateFieldAppleStyle(event.target);
   251	        });
   252	        
   253	        // Apple-style form submission
   254	        form.addEventListener('submit', function(event) {
   255	            if (!validateForm(form)) {
   256	                event.preventDefault();
   257	                showAppleStyleNotification('Please fill in all required fields correctly.', 'error');
   258	                return;
   259	            }
   260	            
   261	            // Show Apple-style loading state
   262	            showAppleFormLoading(form);
   263	            
   264	            console.log(`Form submitted: ${form.action}`);
   265	        });
   266	        
   267	        // Apple-style focus effects for form elements
   268	        const formInputs = form.querySelectorAll('input, select, textarea');
   269	        formInputs.forEach(input => {
   270	            input.addEventListener('focus', function() {
   271	                this.parentElement.style.transform = 'translateY(-2px)';
   272	            });
   273	            
   274	            input.addEventListener('blur', function() {
   275	                this.parentElement.style.transform = 'translateY(0)';
   276	            });
   277	        });
   278	    });
   279	}
   280	
   281	// Apple-style field validation
   282	function validateFieldAppleStyle(field) {
   283	    const fieldGroup = field.closest('.form-group');
   284	    if (!fieldGroup) return;
   285	    
   286	    // Remove existing styling
   287	    field.style.borderColor = '';
   288	    field.style.boxShadow = '';
   289	    const existingError = fieldGroup.querySelector('.field-error');
   290	    if (existingError) {
   291	        existingError.remove();
   292	    }
   293	    
   294	    let isValid = true;
   295	    let errorMessage = '';
   296	    
   297	    // Required field validation
   298	    if (field.hasAttribute('required') && !field.value.trim()) {
   299	        isValid = false;
   300	        errorMessage = 'This field is required';
   301	    }
   302	    
   303	    // Email validation
   304	    if (field.type === 'email' && field.value.trim()) {
   305	        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   306	        if (!emailRegex.test(field.value.trim())) {
   307	            isValid = false;
   308	            errorMessage = 'Please enter a valid email address';
   309	        }
   310	    }
   311	    
   312	    // Phone validation
   313	    if (field.type === 'tel' && field.value.trim()) {
   314	        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
   315	        if (!phoneRegex.test(field.value.trim())) {
   316	            isValid = false;
   317	            errorMessage = 'Please enter a valid phone number';
   318	        }
   319	    }
   320	    
   321	    if (!isValid) {
   322	        // Apple-style error styling
   323	        field.style.borderColor = '#FF3B30';
   324	        field.style.boxShadow = '0 0 0 3px rgba(255, 59, 48, 0.1)';
   325	        
   326	        const errorElement = document.createElement('div');
   327	        errorElement.className = 'field-error';
   328	        errorElement.textContent = errorMessage;
   329	        errorElement.style.cssText = `
   330	            color: #FF3B30;
   331	            font-size: 14px;
   332	            margin-top: 6px;
   333	            opacity: 0;
   334	            transform: translateY(-10px);
   335	            transition: all 0.3s ease;
   336	        `;
   337	        
   338	        fieldGroup.appendChild(errorElement);
   339	        
   340	        // Apple-style error animation
   341	        requestAnimationFrame(() => {
   342	            errorElement.style.opacity = '1';
   343	            errorElement.style.transform = 'translateY(0)';
   344	        });
   345	    } else if (field.value.trim()) {
   346	        // Apple-style success styling
   347	        field.style.borderColor = '#4A7C59';
   348	        field.style.boxShadow = '0 0 0 3px rgba(74, 124, 89, 0.1)';
   349	    }
   350	    
   351	    return isValid;
   352	}
   353	
   354	// Validate entire form
   355	function validateForm(form) {
   356	    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
   357	    let isValid = true;
   358	    
   359	    fields.forEach(field => {
   360	        if (!validateFieldAppleStyle(field)) {
   361	            isValid = false;
   362	        }
   363	    });
   364	    
   365	    return isValid;
   366	}
   367	
   368	// Apple-style form loading state
   369	function showAppleFormLoading(form) {
   370	    const submitButton = form.querySelector('button[type="submit"]');
   371	    if (submitButton) {
   372	        submitButton.disabled = true;
   373	        submitButton.style.opacity = '0.6';
   374	        submitButton.style.transform = 'scale(0.98)';
   375	        
   376	        const originalText = submitButton.textContent;
   377	        submitButton.dataset.originalText = originalText;
   378	        
   379	        // Apple-style loading animation
   380	        submitButton.innerHTML = `
   381	            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
   382	                <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
   383	                Sending...
   384	            </div>
   385	        `;
   386	        
   387	        // Add loading animation CSS
   388	        if (!document.querySelector('#loading-animation-css')) {
   389	            const style = document.createElement('style');
   390	            style.id = 'loading-animation-css';
   391	            style.textContent = `
   392	                @keyframes spin {
   393	                    0% { transform: rotate(0deg); }
   394	                    100% { transform: rotate(360deg); }
   395	                }
   396	            `;
   397	            document.head.appendChild(style);
   398	        }
   399	    }
   400	}
   401	
   402	// Clear form errors with Apple-style animations
   403	function clearFormErrors(container) {
   404	    const errors = container.querySelectorAll('.field-error');
   405	    errors.forEach(error => {
   406	        error.style.opacity = '0';
   407	        error.style.transform = 'translateY(-10px)';
   408	        setTimeout(() => error.remove(), 300);
   409	    });
   410	    
   411	    const inputs = container.querySelectorAll('input, select, textarea');
   412	    inputs.forEach(input => {
   413	        input.style.borderColor = '';
   414	        input.style.boxShadow = '';
   415	    });
   416	    
   417	    // Reset submit buttons
   418	    const submitButtons = container.querySelectorAll('button[type="submit"]');
   419	    submitButtons.forEach(button => {
   420	        button.disabled = false;
   421	        button.style.opacity = '';
   422	        button.style.transform = '';
   423	        if (button.dataset.originalText) {
   424	            button.innerHTML = button.dataset.originalText;
   425	        }
   426	    });
   427	}
   428	
   429	// Apple-style notifications
   430	function showAppleStyleNotification(message, type = 'success') {
   431	    // Remove existing notifications
   432	    const existingNotifications = document.querySelectorAll('.apple-notification');
   433	    existingNotifications.forEach(notification => {
   434	        notification.style.transform = 'translateY(-100px)';
   435	        notification.style.opacity = '0';
   436	        setTimeout(() => notification.remove(), 300);
   437	    });
   438	
   439	    const notification = document.createElement('div');
   440	    notification.className = 'apple-notification';
   441	    notification.textContent = message;
   442	    
   443	    const colors = {
   444	        success: { bg: '#4A7C59', color: 'white' },
   445	        error: { bg: '#FF3B30', color: 'white' },
   446	        warning: { bg: '#FF9F0A', color: 'white' },
   447	        info: { bg: '#007AFF', color: 'white' }
   448	    };
   449	    
   450	    const colorScheme = colors[type] || colors.success;
   451	    
   452	    notification.style.cssText = `
   453	        position: fixed;
   454	        top: 80px;
   455	        left: 50%;
   456	        transform: translateX(-50%) translateY(-100px);
   457	        background: ${colorScheme.bg};
   458	        color: ${colorScheme.color};
   459	        padding: 16px 32px;
   460	        border-radius: 25px;
   461	        font-weight: 500;
   462	        font-size: 16px;
   463	        z-index: 3000;
   464	        opacity: 0;
   465	        transition: all 0.3s ease;
   466	        backdrop-filter: blur(20px);
   467	        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
   468	        max-width: 90%;
   469	        text-align: center;
   470	    `;
   471	    
   472	    document.body.appendChild(notification);
   473	    
   474	    // Apple-style entrance animation
   475	    requestAnimationFrame(() => {
   476	        notification.style.transform = 'translateX(-50%) translateY(0)';
   477	        notification.style.opacity = '1';
   478	    });
   479	    
   480	    // Auto-remove with Apple-style exit animation
   481	    setTimeout(() => {
   482	        notification.style.transform = 'translateX(-50%) translateY(-100px)';
   483	        notification.style.opacity = '0';
   484	        setTimeout(() => {
   485	            if (document.body.contains(notification)) {
   486	                document.body.removeChild(notification);
   487	            }
   488	        }, 300);
   489	    }, 4000);
   490	    
   491	    // Click to dismiss
   492	    notification.addEventListener('click', function() {
   493	        this.style.transform = 'translateX(-50%) translateY(-100px)';
   494	        this.style.opacity = '0';
   495	        setTimeout(() => {
   496	            if (document.body.contains(this)) {
   497	                document.body.removeChild(this);
   498	            }
   499	        }, 300);
   500	    });
   501	}
   502	
   503	// Apple-style smooth scrolling
   504	function initSmoothScrolling() {
   505	    const navLinks = document.querySelectorAll('a[href^="#"]');
   506	    
   507	    navLinks.forEach(link => {
   508	        link.addEventListener('click', function(event) {
   509	            event.preventDefault();
   510	            
   511	            const targetId = this.getAttribute('href');
   512	            const targetElement = document.querySelector(targetId);
   513	            
   514	            if (targetElement) {
   515	                const navbar = document.querySelector('.nav');
   516	                const navbarHeight = navbar ? navbar.offsetHeight : 60;
   517	                const targetPosition = targetElement.offsetTop - navbarHeight;
   518	                
   519	                // Apple-style smooth scroll with easing
   520	                smoothScrollTo(targetPosition, 800);
   521	            }
   522	        });
   523	    });
   524	}
   525	
   526	// Custom smooth scroll function with Apple-style easing
   527	function smoothScrollTo(target, duration) {
   528	    const start = window.pageYOffset;
   529	    const distance = target - start;
   530	    const startTime = performance.now();
   531	
   532	    function scroll(currentTime) {
   533	        const timeElapsed = currentTime - startTime;
   534	        const progress = Math.min(timeElapsed / duration, 1);
   535	        
   536	        // Apple-style easing function
   537	        const ease = progress < 0.5 
   538	            ? 4 * progress * progress * progress 
   539	            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
   540	        
   541	        window.scrollTo(0, start + distance * ease);
   542	        
   543	        if (progress < 1) {
   544	            requestAnimationFrame(scroll);
   545	        }
   546	    }
   547	    
   548	    requestAnimationFrame(scroll);
   549	}
   550	
   551	// Apple-style scroll effects
   552	function initScrollEffects() {
   553	    const navbar = document.querySelector('.nav');
   554	    let lastScrollTop = 0;
   555	    let ticking = false;
   556	    
   557	    function updateNavbar() {
   558	        const scrollTop = window.pageYOffset;
   559	        
   560	        // Navbar background and blur effect
   561	        if (scrollTop > 50) {
   562	            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
   563	            navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
   564	            navbar.style.borderBottomColor = 'rgba(0, 0, 0, 0.15)';
   565	        } else {
   566	            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
   567	            navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
   568	            navbar.style.borderBottomColor = 'rgba(0, 0, 0, 0.1)';
   569	        }
   570	        
   571	        // Optional: Hide/show navbar on scroll (disabled for Apple-like behavior)
   572	        // Apple typically keeps the navbar visible
   573	        
   574	        lastScrollTop = scrollTop;
   575	        ticking = false;
   576	    }
   577	    
   578	    window.addEventListener('scroll', function() {
   579	        if (!ticking) {
   580	            requestAnimationFrame(updateNavbar);
   581	            ticking = true;
   582	        }
   583	    });
   584	    
   585	    // Create Apple-style scroll-to-top button
   586	    createAppleScrollToTop();
   587	}
   588	
   589	// Apple-style scroll-to-top button
   590	function createAppleScrollToTop() {
   591	    const scrollBtn = document.createElement('button');
   592	    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
   593	    scrollBtn.className = 'apple-scroll-to-top';
   594	    scrollBtn.setAttribute('aria-label', 'Scroll to top');
   595	    
   596	    scrollBtn.style.cssText = `
   597	        position: fixed;
   598	        bottom: 30px;
   599	        right: 30px;
   600	        width: 50px;
   601	        height: 50px;
   602	        background: rgba(74, 124, 89, 0.9);
   603	        color: white;
   604	        border: none;
   605	        border-radius: 25px;
   606	        cursor: pointer;
   607	        font-size: 18px;
   608	        backdrop-filter: blur(20px);
   609	        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
   610	        opacity: 0;
   611	        visibility: hidden;
   612	        transform: translateY(20px) scale(0.8);
   613	        transition: all 0.3s ease;
   614	        z-index: 1000;
   615	    `;
   616	    
   617	    document.body.appendChild(scrollBtn);
   618	    
   619	    // Show/hide with Apple-style animation
   620	    window.addEventListener('scroll', function() {
   621	        if (window.pageYOffset > 500) {
   622	            scrollBtn.style.opacity = '1';
   623	            scrollBtn.style.visibility = 'visible';
   624	            scrollBtn.style.transform = 'translateY(0) scale(1)';
   625	        } else {
   626	            scrollBtn.style.opacity = '0';
   627	            scrollBtn.style.visibility = 'hidden';
   628	            scrollBtn.style.transform = 'translateY(20px) scale(0.8)';
   629	        }
   630	    });
   631	    
   632	    // Scroll to top with smooth animation
   633	    scrollBtn.addEventListener('click', function() {
   634	        smoothScrollTo(0, 800);
   635	    });
   636	    
   637	    // Apple-style hover effects
   638	    scrollBtn.addEventListener('mouseenter', function() {
   639	        this.style.background = 'rgba(58, 95, 71, 0.9)';
   640	        this.style.transform = 'translateY(0) scale(1.1)';
   641	    });
   642	    
   643	    scrollBtn.addEventListener('mouseleave', function() {
   644	        this.style.background = 'rgba(74, 124, 89, 0.9)';
   645	        this.style.transform = 'translateY(0) scale(1)';
   646	    });
   647	}
   648	
   649	// Form success handling (for Formspree integration)
   650	function handleFormSuccess(form) {
   651	    form.reset();
   652	    clearFormErrors(form.closest('.modal') || document);
   653	    showAppleStyleNotification('Thank you! Your message has been sent successfully.', 'success');
   654	    
   655	    const modal = form.closest('.modal');
   656	    if (modal) {
   657	        setTimeout(() => closeModal(modal.id), 1500);
   658	    }
   659	    
   660	    console.log('Form submitted successfully:', form.action);
   661	}
   662	
   663	// Enhanced accessibility
   664	function initAccessibility() {
   665	    // Skip to main content link with Apple styling
   666	    const skipLink = document.createElement('a');
   667	    skipLink.href = '#main';
   668	    skipLink.textContent = 'Skip to main content';
   669	    skipLink.style.cssText = `
   670	        position: absolute;
   671	        top: -50px;
   672	        left: 20px;
   673	        background: #4A7C59;
   674	        color: white;
   675	        padding: 12px 20px;
   676	        text-decoration: none;
   677	        border-radius: 8px;
   678	        z-index: 3000;
   679	        font-weight: 500;
   680	        transition: top 0.3s ease;
   681	        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
   682	    `;
   683	    
   684	    skipLink.addEventListener('focus', function() {
   685	        this.style.top = '20px';
   686	    });
   687	    
   688	    skipLink.addEventListener('blur', function() {
   689	        this.style.top = '-50px';
   690	    });
   691	    
   692	    document.body.insertBefore(skipLink, document.body.firstChild);
   693	    
   694	    // Add main id to hero section
   695	    const hero = document.querySelector('.hero');
   696	    if (hero) {
   697	        hero.setAttribute('id', 'main');
   698	    }
   699	}
   700	
   701	// Initialize accessibility features
   702	initAccessibility();
   703	
   704	// Handle online/offline status with Apple-style notifications
   705	window.addEventListener('online', function() {
   706	    showAppleStyleNotification('Connection restored', 'success');
   707	});
   708	
   709	window.addEventListener('offline', function() {
   710	    showAppleStyleNotification('You appear to be offline', 'warning');
   711	});
   712	
   713	// Export functions for HTML onclick handlers
   714	window.openModal = openModal;
   715	window.closeModal = closeModal;
   716	
   717	// Enhanced error handling
   718	window.addEventListener('error', function(event) {
   719	    console.error('JavaScript error:', event.error);
   720	});
   721	
   722	// Performance optimization: Debounce scroll events
   723	function debounce(func, wait) {
   724	    let timeout;
   725	    return function executedFunction(...args) {
   726	        const later = () => {
   727	            clearTimeout(timeout);
   728	            func(...args);
   729	        };
   730	        clearTimeout(timeout);
   731	        timeout = setTimeout(later, wait);
   732	    };
   733	}
   734	
   735	// Apply debouncing to scroll-heavy functions
   736	const debouncedHighlight = debounce(highlightActiveNavLink, 10);
   737	window.removeEventListener('scroll', highlightActiveNavLink);
   738	window.addEventListener
