// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        html.classList.add('light-mode');
    }
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('light-mode');
    const isLight = html.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll and Scrollspy
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skill cards, project cards, service cards, testimonial cards
document.querySelectorAll('.skill-card, .project-card, .service-card, .testimonial-card, .timeline-content').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validate form
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Show success message
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Message Sent!';
    submitBtn.style.backgroundColor = 'var(--gold)';

    // Reset form
    contactForm.reset();

    // Restore button after 3 seconds
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
    }, 3000);
});

// Initialize
initTheme();
updateActiveLink();

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect on hero section (subtle)
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Add stagger animation to hero elements
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroRole = document.querySelector('.hero-role');
    const heroTagline = document.querySelector('.hero-tagline');
    const heroCta = document.querySelector('.hero-cta');

    // Reset animations
    heroTitle.style.animation = 'none';
    heroRole.style.animation = 'none';
    heroTagline.style.animation = 'none';
    heroCta.style.animation = 'none';

    // Trigger reflow
    void heroTitle.offsetWidth;

    // Apply animations
    heroTitle.style.animation = 'fadeInUp 1s ease-out 0.1s both';
    heroRole.style.animation = 'fadeInUp 1s ease-out 0.2s both';
    heroTagline.style.animation = 'fadeInUp 1s ease-out 0.3s both';
    heroCta.style.animation = 'fadeInUp 1s ease-out 0.4s both';
});

// Enhance button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Accessibility: Announce section changes to screen readers
function announceSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const title = section.querySelector('h2, h1');
        if (title) {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Navigated to ${title.textContent}`;
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        }
    }
}

// Update announcement on navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        const sectionId = href.slice(1);
        announceSection(sectionId);
    });
});
