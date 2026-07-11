// ============================================
// KENOC NIGERIA LIMITED - SHARED JAVASCRIPT
// Handles mobile menu, scroll animations, and interactions
// ============================================

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // MOBILE MENU TOGGLE
    // Opens/closes navigation on mobile devices
    // ============================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        // Toggle menu when hamburger is clicked
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Animate hamburger icon to X shape
            const spans = this.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                // Transform to X
                spans[0].style.transform = 'rotate(45deg) translateY(12px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-12px)';
            } else {
                // Transform back to hamburger
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on a navigation link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                // Reset hamburger icon
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
        
        // Close mobile menu when clicking outside of nav area
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    // Reset hamburger icon
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }
    
    // ============================================
    // SCROLL FADE-IN ANIMATIONS
    // Elements with .fade-in class animate when scrolled into view
    // ============================================
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Intersection Observer options
    const observerOptions = {
        root: null,              // Use viewport as root
        rootMargin: '0px',       // No margin
        threshold: 0.1           // Trigger when 10% of element is visible
    };
    
    // Create observer to watch for elements entering viewport
    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger fade-in animation
                entry.target.classList.add('visible');
                // Stop observing this element (animation only happens once)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // Smoothly scrolls to sections when clicking internal links
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle valid anchors (not just #)
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate position accounting for fixed header
                    const headerOffset = 100;  // Height of fixed header + padding
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    // Smooth scroll to position
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================================
    // HEADER SHADOW ON SCROLL
    // Adds shadow to header when user scrolls down
    // ============================================
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Solidify the frosted header once scrolled past the hero edge
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ============================================
    // ACTIVE NAV LINK HIGHLIGHT
    // Highlights current page in navigation
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.main-nav a');
    
    navLinksAll.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // ============================================
    // ACCESSIBILITY: RESPECT REDUCED MOTION PREFERENCE
    // Disables animations for users who prefer reduced motion
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable all animations for accessibility
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // CONTACT FORM HANDLING WITH FORMSUBMIT
    // Handles form submission with loading state and success message
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    const formError = document.getElementById('formError');

    // Reveal the inline error message, or fall back to an alert if it's missing
    function showFormError() {
        if (formError) {
            formError.hidden = false;
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            alert('There was a problem submitting your form. Please try again or contact us directly at kenocnigerialtd@yahoo.com');
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (formError) formError.hidden = true;

            // Show loading spinner and disable button
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            // FormSubmit's AJAX endpoint is CORS-enabled and returns JSON,
            // which is the reliable way to submit via fetch. Derived from the
            // form's action so the no-JS fallback POST still works.
            const ajaxUrl = contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

            fetch(ajaxUrl, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(function(response) {
                return response.json()
                    .catch(function() { return {}; })
                    .then(function(data) { return { ok: response.ok, data: data }; });
            })
            .then(function(result) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                var delivered = result.ok && (result.data.success === true || result.data.success === 'true');
                if (delivered) {
                    contactForm.classList.add('hidden');
                    successMessage.classList.add('show');
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    showFormError();
                }
            })
            .catch(function(error) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showFormError();
                console.error('Form submission error:', error);
            });
        });
    }
    
});

// ============================================
// UTILITY FUNCTIONS
// Helper functions used throughout the site
// ============================================

/**
 * Debounce function - Limits how often a function can run
 * Useful for scroll and resize event handlers
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Milliseconds to wait
 * @param {Boolean} immediate - Run on leading edge
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element to check
 * @returns {Boolean} - True if element is visible in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}







 const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length > 0 && lightbox) {
        // Add click event to each gallery item
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('.gallery-image img');
                const caption = this.getAttribute('data-caption') || this.querySelector('.gallery-caption')?.textContent;
                
                if (img) {
                    lightbox.style.display = 'block';
                    lightboxImg.src = img.src;
                    if (caption) {
                        lightboxCaption.textContent = caption;
                    }
                }
            });
        });

        // Close lightbox when clicking the X
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                lightbox.style.display = 'none';
            });
        }

        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        // Close lightbox with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                lightbox.style.display = 'none';
            }
        });
    }
    
;

// ============================================
// UTILITY FUNCTIONS
// Helper functions used throughout the site
// ============================================

/**
 * Debounce function - Limits how often a function can run
 * Useful for scroll and resize event handlers
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Milliseconds to wait
 * @param {Boolean} immediate - Run on leading edge
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element to check
 * @returns {Boolean} - True if element is visible in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


















