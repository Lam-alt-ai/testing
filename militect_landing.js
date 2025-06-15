// Militect Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Animate feature items on scroll
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-item, .step').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };

    // Initialize animations
    observeElements();

    // Add hover effects to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add parallax effect to background elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const bgOverlay = document.querySelector('.bg-overlay');
        if (bgOverlay) {
            bgOverlay.style.transform = `translateY(${rate}px)`;
        }
    });

    // Console security message
    console.log('%cMILITECT SECURITY NOTICE', 'color: #ff4444; font-size: 20px; font-weight: bold;');
    console.log('%cUnauthorized access to this system is prohibited.', 'color: #ff4444; font-size: 14px;');
    console.log('%cAll activities are monitored and logged.', 'color: #ff4444; font-size: 14px;');
});