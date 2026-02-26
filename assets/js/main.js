/**
 * James Homer Portfolio - Main JavaScript
 * Contains general website functionality not related to the terminal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = targetId ? document.querySelector(targetId) : null;

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNavLink() {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200 && window.pageYOffset < sectionTop + sectionHeight - 200) {
                currentSectionId = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            const isCurrent = link.getAttribute('href') === `#${currentSectionId}`;
            link.classList.toggle('active', isCurrent);
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
});
