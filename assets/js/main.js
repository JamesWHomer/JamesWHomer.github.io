/**
 * James Homer Portfolio - Main JavaScript
 * Contains general website functionality not related to the terminal
 */

document.addEventListener('DOMContentLoaded', function() {
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Navbar shadow/border state on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const updateNavbarState = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 10);
        };
        updateNavbarState();
        window.addEventListener('scroll', updateNavbarState, { passive: true });
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

    // Highlight active nav link based on current scroll position
    const navLinksAll = document.querySelectorAll('.nav-links a');
    const trackedSections = [...navLinksAll]
        .map(link => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return null;
            return document.querySelector(href);
        })
        .filter(Boolean);

    const setActiveNavLink = (targetHref) => {
        navLinksAll.forEach(link => {
            link.classList.toggle('active', !!targetHref && link.getAttribute('href') === targetHref);
        });
    };

    const updateActiveNavLink = () => {
        const navOffset = (navbar?.offsetHeight || 80) + 20;
        const markerY = window.scrollY + navOffset;
        let activeSection = null;

        trackedSections.forEach(section => {
            if (section.offsetTop <= markerY) {
                activeSection = section;
            }
        });

        setActiveNavLink(activeSection ? `#${activeSection.id}` : null);
    };

    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    window.addEventListener('resize', updateActiveNavLink);
});