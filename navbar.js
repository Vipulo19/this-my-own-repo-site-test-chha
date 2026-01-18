/**
 * Dharma Dairy & Veg - Accessible Navbar
 * Logic for mobile toggle, focus trap, and keyboard navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('main-nav');
    const toggleBtn = document.querySelector('.navbar__toggle');
    const menu = document.getElementById('navbar-menu');
    const dropdownToggles = document.querySelectorAll('.navbar__link--dropdown');

    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    });

    // Mobile Menu Toggle
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            menu.setAttribute('data-visible', !isExpanded);
            document.body.style.overflow = !isExpanded ? 'hidden' : ''; // Prevent scroll

            if (!isExpanded) {
                // Focus trap logic could go here
                menu.querySelector('a')?.focus();
            }
        });
    }

    // Dropdown Toggles (Click for mobile/accessibility)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Only toggle on mobile or if it's not a link
            if (window.innerWidth <= 900 || !toggle.getAttribute('href') || toggle.getAttribute('href') === '#') {
                e.preventDefault();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                // Close other dropdowns
                dropdownToggles.forEach(other => {
                    if (other !== toggle) other.setAttribute('aria-expanded', 'false');
                });

                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });

        // Key support for Space/Enter if button doesn't handle natively
        toggle.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggle.click();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggleBtn.contains(e.target) && menu.getAttribute('data-visible') === 'true') {
            toggleBtn.click();
        }

        // Close dropdowns when clicking outside
        if (!e.target.closest('.navbar__item--has-dropdown')) {
            dropdownToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (menu.getAttribute('data-visible') === 'true') {
                toggleBtn.click();
                toggleBtn.focus();
            }
            dropdownToggles.forEach(t => {
                if (t.getAttribute('aria-expanded') === 'true') {
                    t.setAttribute('aria-expanded', 'false');
                    t.focus();
                }
            });
        }
    });
});
