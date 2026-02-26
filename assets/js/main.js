/**
 * James Homer Portfolio - Main JavaScript
 * Contains general website functionality not related to the terminal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle behavior
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.nav-links-mobile a');

    if (menuToggle && mobileMenu) {
        const openMenu = function() {
            mobileMenu.hidden = false;
            mobileMenu.classList.add('active');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = function(restoreFocus = false) {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.hidden = true;

            if (restoreFocus) {
                menuToggle.focus();
            }
        };

        const isMenuOpen = function() {
            return menuToggle.getAttribute('aria-expanded') === 'true';
        };

        menuToggle.addEventListener('click', function() {
            if (isMenuOpen()) {
                closeMenu();
                return;
            }

            openMenu();
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen()) {
                closeMenu(true);
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isMenuOpen()) {
                closeMenu();
            }
        });
    }

    // Fade-in animations for elements as they enter viewport
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // Initialize any third-party libraries or components
    initializeThirdPartyComponents();
});

/**
 * Initialize any third-party components or libraries
 * This keeps the main function clean and organized
 */
function initializeThirdPartyComponents() {
    // Example: Initialize tooltips if using Bootstrap
    // if (typeof bootstrap !== 'undefined') {
    //     var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    //     tooltipTriggerList.map(function (tooltipTriggerEl) {
    //         return new bootstrap.Tooltip(tooltipTriggerEl)
    //     });
    // }
}

/**
 * Utility function to check if element is in viewport
 * @param {HTMLElement} el - The element to check
 * @returns {boolean} - Whether the element is in viewport
 */
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add active class to nav items on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200 && window.pageYOffset < sectionTop + sectionHeight - 200) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});
