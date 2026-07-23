/**
 * Main JavaScript File for Connor Passingham Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Toggle ---
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            mobileToggle.classList.toggle('is-active');
            nav.classList.toggle('is-open');
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('is-open')) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.classList.remove('is-active');
                    nav.classList.remove('is-open');
                }
            });
        });
    }

    // --- Header Scroll Style ---
    const header = document.getElementById('site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on load

    // --- Active Navigation Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    
    const navHighlighter = () => {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Adjust offset to trigger highlight a bit earlier when scrolling down
            const sectionTop = current.offsetTop - 150; 
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-list a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-list a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', navHighlighter, { passive: true });

    // --- Scroll Reveal Animation ---
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed to keep it visible
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- Dynamic Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
