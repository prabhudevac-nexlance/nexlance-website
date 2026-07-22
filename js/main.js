document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILE MENU DRAWER CONTROLLER
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const closeDrawerBtn = document.querySelector('.close-drawer');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    const openDrawer = () => {
        mobileDrawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', openDrawer);
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeDrawer);
    }

    // Close drawer when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Close drawer when clicking outside the panel
    document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('active') &&
            !mobileDrawer.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            closeDrawer();
        }
    });


    /* ==========================================================================
       2. SOLUTIONS TAB SYSTEM
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate all buttons & panes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Activate current button & pane
            btn.classList.add('active');
            const activePane = document.getElementById(targetTab);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       3. MOUSE CARD GLOW EFFECT (Vercel / Linear style)
       ========================================================================== */
    const glowCards = document.querySelectorAll('.glow-card, .why-card, .industry-card');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* ==========================================================================
       4. SCROLL REVEAL & APPROACH TIMELINE TRACKING
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineProgress = document.querySelector('.timeline-progress');

    // Reveal elements on scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Timeline Step Observer
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                updateTimelineProgress();
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -10% 0px'
    });

    timelineSteps.forEach(step => {
        timelineObserver.observe(step);
    });

    const updateTimelineProgress = () => {
        if (!timelineSteps.length || !timelineProgress) return;

        let activeCount = 0;
        timelineSteps.forEach(step => {
            if (step.classList.contains('active')) {
                activeCount++;
            }
        });

        // Calculate progress percentage
        // Step 1 active = 0%, Step 2 active = 33%, Step 3 active = 66%, Step 4 active = 100%
        const percentage = ((activeCount - 1) / (timelineSteps.length - 1)) * 100;
        timelineProgress.style.height = `${Math.max(0, percentage)}%`;
    };


    /* ==========================================================================
       5. SAAS WAITLIST SIGNUP HANDLER
       ========================================================================== */
    const waitlistForm = document.querySelector('.saas-waitlist-form');
    const waitlistMsg = document.querySelector('.waitlist-msg');

    if (waitlistForm && waitlistMsg) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = waitlistForm.querySelector('.waitlist-input');
            const email = emailInput.value.trim();

            if (email) {
                // Show loading state
                waitlistMsg.className = 'waitlist-msg';
                waitlistMsg.textContent = 'Joining waitlist...';
                waitlistMsg.style.color = 'var(--text-secondary)';

                setTimeout(() => {
                    waitlistMsg.textContent = 'Success! You have been added to the waitlist.';
                    waitlistMsg.classList.add('success');
                    waitlistMsg.style.color = 'var(--color-teal)';
                    emailInput.value = '';
                }, 1200);
            }
        });
    }


    /* ==========================================================================
       6. CONTACT FORM SUBMISSION & SUCCESS OVERLAY
       ========================================================================== */
    const inquiryForm = document.getElementById('inquiry-form');
    const successOverlay = document.querySelector('.form-success-overlay');
    console.log("hrere================", successOverlay);
    const resetFormBtn = document.querySelector('.reset-form-btn');

    if (inquiryForm && successOverlay) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("clciked submit button");

            // Simple visual validation check
            const name = document.getElementById('c-name').value.trim();
            const email = document.getElementById('c-email').value.trim();
            const service = document.getElementById('c-service').value;
            const message = document.getElementById('c-msg').value.trim();

            if (name && email && service && message) {
                // Submit to Formspree
                const submitBtn = inquiryForm.querySelector('button[type="submit"]');
                const origBtnText = submitBtn.innerHTML;

                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting... <i class="fa-solid fa-spinner fa-spin ml-sm"></i>';

                const phone = document.getElementById('c-phone').value.trim();
                const company = document.getElementById('c-company').value.trim();

                fetch('https://script.google.com/macros/s/AKfycbxEbHlSmPvcBSJWH45WmJQlkFcKVl9VsPY-lhSr5nDRJITdsfmZSv3k4hyE9AQo5u4T/exec', {
                    method: 'POST',
                    mode: 'no-cors', // Bypasses CORS and allows the request to go through
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        company: company,
                        service: service,
                        message: message
                    })
                })
                    .then(() => {
                        // DO NOT use response.json() here when mode is 'no-cors'
                        // If execution reached here without a network drop, the submit succeeded!
                        if (typeof successOverlay !== 'undefined') {
                            successOverlay.classList.add('active');
                        } else {
                            alert('Thank you! Your inquiry has been sent.');
                        }
                        inquiryForm.reset();
                    })
                    .catch(error => {
                        console.error('Submission error:', error);
                        alert('Oops! There was a network error. Please try again.');
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = origBtnText;
                    });
            }
        });
    }

    if (resetFormBtn && successOverlay) {
        resetFormBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
    }


    /* ==========================================================================
       7. SMOOTH INTER-SECTION HEADER TRANSITION
       ========================================================================== */
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(6, 5, 12, 0.9)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(6, 5, 12, 0.75)';
            header.style.boxShadow = 'none';
        }
    });

});
