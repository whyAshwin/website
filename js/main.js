// Modern Portfolio JavaScript - Sliding Sections
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSlidingSections();
    initNavigation();
    initMobileMenu();
    initKeyboardNavigation();
});

// Sliding sections functionality
function initSlidingSections() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionDots = document.querySelectorAll('.section-dot');
    let currentSection = 0;
    let isAnimating = false;

    // Function to show specific section
    function showSection(index) {
        if (isAnimating || index === currentSection) return;
        
        isAnimating = true;
        
        // Remove active classes
        sections[currentSection].classList.remove('active');
        sections[currentSection].classList.add('prev');
        
        // Update current section
        const prevSection = currentSection;
        currentSection = index;
        
        // Add active class to new section
        sections[currentSection].classList.remove('prev');
        sections[currentSection].classList.add('active');
        
        // Update navigation
        updateNavigation();
        
        // Reset animation flag after transition
        setTimeout(() => {
            sections[prevSection].classList.remove('prev');
            isAnimating = false;
        }, 800);
    }

    // Update navigation active states
    function updateNavigation() {
        navLinks.forEach((link, index) => {
            link.classList.toggle('active', index === currentSection);
        });
        
        sectionDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSection);
        });
    }

    // Handle navigation clicks
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(index);
        });
    });

    // Handle section dots clicks
    sectionDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSection(index);
        });
    });

    // Handle scroll wheel navigation
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        if (isAnimating) return;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0 && currentSection < sections.length - 1) {
                // Scroll down
                showSection(currentSection + 1);
            } else if (e.deltaY < 0 && currentSection > 0) {
                // Scroll up
                showSection(currentSection - 1);
            }
        }, 50);
    }, { passive: true });

    // Handle touch navigation for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (isAnimating) return;
        
        touchEndY = e.changedTouches[0].screenY;
        const touchDiff = touchStartY - touchEndY;
        
        // Minimum swipe distance
        if (Math.abs(touchDiff) > 50) {
            if (touchDiff > 0 && currentSection < sections.length - 1) {
                // Swipe up - next section
                showSection(currentSection + 1);
            } else if (touchDiff < 0 && currentSection > 0) {
                // Swipe down - previous section
                showSection(currentSection - 1);
            }
        }
    }, { passive: true });

    // Expose showSection function globally for button clicks
    window.showSection = showSection;
}

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav');
    
    // Handle scroll effect on navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const sections = document.querySelectorAll('.section');
        const currentIndex = Array.from(sections).findIndex(section => 
            section.classList.contains('active')
        );
        
        switch(e.key) {
            case 'ArrowDown':
            case ' ': // Spacebar
                e.preventDefault();
                if (currentIndex < sections.length - 1) {
                    window.showSection(currentIndex + 1);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    window.showSection(currentIndex - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                window.showSection(0);
                break;
            case 'End':
                e.preventDefault();
                window.showSection(sections.length - 1);
                break;
        }
    });
}

// Handle button clicks that navigate to sections
document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-section')) {
        e.preventDefault();
        const sectionIndex = parseInt(e.target.getAttribute('data-section'));
        window.showSection(sectionIndex);
    }
});

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = document.createElement('style');
    style.textContent = `
        .section {
            transition: transform 0.3s ease !important;
        }
        .section-content {
            transition: all 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
}

// Preload next section content for better performance
function preloadNextSection() {
    const sections = document.querySelectorAll('.section');
    const currentIndex = Array.from(sections).findIndex(section => 
        section.classList.contains('active')
    );
    
    // Preload images in next section if any
    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        const images = nextSection.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadNextSection);