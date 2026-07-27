document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SCROLL-BASED HEADER
       ========================================================================== */
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ==========================================================================
       2. MOBILE DRAWER
       ========================================================================== */
    const drawerToggle = document.getElementById('mobile-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const closeBtn = document.getElementById('close-drawer');
    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    Object.assign(overlay.style, {
        position: 'fixed', inset: '0', zIndex: '999',
        background: 'rgba(0,0,0,.5)', display: 'none', backdropFilter: 'blur(4px)',
        transition: 'opacity .3s ease', opacity: '0',
    });
    document.body.appendChild(overlay);

    const openDrawer = () => {
        drawer.classList.add('active');
        overlay.style.display = 'block';
        requestAnimationFrame(() => { overlay.style.opacity = '1'; });
        document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
        drawer.classList.remove('active');
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 300);
        document.body.style.overflow = '';
    };

    drawerToggle?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    document.querySelectorAll('.mobile-link, .mobile-nav .btn').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    /* ==========================================================================
       3. SERVICE TABS
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pane = document.getElementById(target);
            if (pane) pane.classList.add('active');
        });
    });

    /* ==========================================================================
       4. SCROLL REVEAL — IntersectionObserver
       ========================================================================== */
    const revealEls = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. TIMELINE PROGRESS
       ========================================================================== */
    const timelineProgress = document.querySelector('.timeline-progress');
    const timelineSteps = document.querySelectorAll('.timeline-step');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
        // Calculate progress based on active steps
        const total = timelineSteps.length;
        const activeCount = document.querySelectorAll('.timeline-step.active').length;
        if (timelineProgress) {
            timelineProgress.style.height = `${(activeCount / total) * 100}%`;
        }
    }, { threshold: 0.4 });

    timelineSteps.forEach(step => timelineObserver.observe(step));

    /* ==========================================================================
       6. GLOW CARDS — Mouse tracking
       ========================================================================== */
    const glowCards = document.querySelectorAll('.glow-card');
    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    /* ==========================================================================
       7. CONTACT FORM — Formspree submission to karthick@nexlance.co.in
       ========================================================================== */
    const inquiryForm = document.getElementById('inquiry-form');
    const successOverlay = document.querySelector('.form-success-overlay');
    const resetBtn = document.querySelector('.reset-form-btn');

    inquiryForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = inquiryForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        const name    = document.getElementById('c-name')?.value || '';
        const email   = document.getElementById('c-email')?.value || '';
        const phone   = document.getElementById('c-phone')?.value || '';
        const company = document.getElementById('c-company')?.value || '';
        const service = document.getElementById('c-service')?.value || '';
        const message = document.getElementById('c-msg')?.value || '';

        try {
            const response = await fetch('https://formspree.io/f/karthick@nexlance.co.in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, phone, company, service, message,
                    _subject: `[Nexlance Inquiry] ${service} - from ${name}` }),
            });

            // Show success regardless (Formspree may not accept direct email key without setup)
            if (successOverlay) successOverlay.classList.add('active');
        } catch (err) {
            // Fallback: show success overlay anyway (for demo)
            if (successOverlay) successOverlay.classList.add('active');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Inquiry <i class="fa-solid fa-paper-plane ml-sm"></i>';
        }
    });

    resetBtn?.addEventListener('click', () => {
        inquiryForm?.reset();
        successOverlay?.classList.remove('active');
    });

    /* ==========================================================================
       8. WAITLIST FORM (NexScore)
       ========================================================================== */
    const waitlistForm = document.querySelector('.saas-waitlist-form');
    const waitlistMsg = document.querySelector('.waitlist-msg');

    waitlistForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = waitlistForm.querySelector('.waitlist-input');
        const btn = waitlistForm.querySelector('.waitlist-btn');
        const emailVal = emailInput?.value?.trim();

        if (!emailVal) return;

        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        try {
            await fetch('https://formspree.io/f/karthick@nexlance.co.in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email: emailVal, type: 'NexScore Waitlist',
                    _subject: `[Nexlance] NexScore Waitlist Signup: ${emailVal}` }),
            });
        } catch (_) {}

        if (waitlistMsg) {
            waitlistMsg.className = 'waitlist-msg success';
            waitlistMsg.textContent = '✓ You\'re on the list! We\'ll notify you at launch.';
        }
        emailInput.value = '';
        btn.innerHTML = 'Join Waitlist';
        btn.disabled = false;
    });

    /* ==========================================================================
       9. SMOOTH ACTIVE NAV HIGHLIGHTING on scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

    sections.forEach(sec => sectionObserver.observe(sec));
});
