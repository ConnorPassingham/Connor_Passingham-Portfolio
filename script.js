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

    // --- Lazy Load PDF Previews (Education Section) ---
    const previewPanel = document.getElementById('academic-preview-panel');
    if (previewPanel) {
        previewPanel.addEventListener('toggle', function() {
            if (this.open && window.innerWidth > 768) {
                // Find iframes with a data-src attribute and set the src
                const iframes = this.querySelectorAll('iframe[data-src]');
                iframes.forEach(iframe => {
                    if (!iframe.getAttribute('src')) {
                        iframe.setAttribute('src', iframe.getAttribute('data-src'));
                    }
                });
            }
        });
    }

    // --- Modal System for Projects ---
    const modalOpenButtons = document.querySelectorAll('[data-modal-target]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    let previouslyFocusedElement = null;

    // Helper: Determine scrollbar width to prevent layout shift on body lock
    const getScrollbarWidth = () => {
        return window.innerWidth - document.documentElement.clientWidth;
    };

    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        previouslyFocusedElement = document.activeElement;
        
        // Prevent body scroll and layout shift
        document.body.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);
        document.body.classList.add('modal-open');
        
        modal.classList.add('is-open');
        
        // Setup focus trapping inside the open modal
        const focusableElements = modal.querySelectorAll(
            'a[href], button, textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            setTimeout(() => {
                focusableElements[0].focus();
            }, 100);
        }
    };

    const closeModal = (modal) => {
        if (!modal) return;
        
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('--scrollbar-width');
        
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    };

    // Attach open events
    modalOpenButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-target');
            openModal(modalId);
        });
    });

    // Attach close events (buttons and overlay background)
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Keyboard events for Modals
    document.addEventListener('keydown', (e) => {
        const openModalElement = document.querySelector('.modal.is-open');
        if (!openModalElement) return;

        // Escape to close
        if (e.key === 'Escape') {
            closeModal(openModalElement);
        }
        
        // Tab focus trapping
        if (e.key === 'Tab') {
            const focusableElements = openModalElement.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) {
                e.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // --- Project Modal Gallery Setup ---
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => {
        const mainImg = modal.querySelector('.gallery-active-img');
        const thumbBtns = modal.querySelectorAll('.thumb-btn');

        if (mainImg && thumbBtns.length > 0) {
            thumbBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active state from all thumbs in this modal
                    thumbBtns.forEach(t => t.classList.remove('active'));
                    // Add active state to clicked thumb
                    btn.classList.add('active');
                    // Update main image src
                    const newSrc = btn.getAttribute('data-img-src');
                    if (newSrc) {
                        mainImg.src = newSrc;
                    }
                });
            });
        }
    });

    // --- Dynamic Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
