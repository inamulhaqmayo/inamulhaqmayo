// Configuration
const API_URL = 'http://localhost:3001/api/portfolio';

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

// ============================================
// BACKEND DATA LOADING
// ============================================

async function loadPortfolioData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch portfolio data');

        const data = await response.json();

        // Update hero section
        updateHeroSection(data.hero);

        // Update about section
        updateAboutSection(data.about);

        // Update skills
        updateSkillsSection(data.skills);

        // Update projects
        updateProjectsSection(data.projects);

        // Update services
        updateServicesSection(data.services);

        // Update experience
        updateExperienceSection(data.experience);

        // Update testimonials
        updateTestimonialsSection(data.testimonials);

        // Observe new elements for animations
        observeNewElements();

        console.log('Portfolio data loaded successfully');
    } catch (err) {
        console.error('Error loading portfolio data:', err);
        // Fallback: keep existing hardcoded content
    }
}

function updateHeroSection(heroData) {
    const heroTitle = document.querySelector('.hero-title');
    const heroRole = document.querySelector('.hero-role');
    const heroTagline = document.querySelector('.hero-tagline');

    if (heroTitle) heroTitle.textContent = heroData.title;
    if (heroRole) heroRole.textContent = heroData.role;
    if (heroTagline) heroTagline.textContent = heroData.tagline;
}

function updateAboutSection(aboutData) {
    const aboutContent = document.querySelector('.about-content');
    if (!aboutContent) return;

    const paragraphs = aboutContent.querySelectorAll('p:not(.stat-label)');
    if (paragraphs.length > 0) {
        paragraphs[0].textContent = aboutData.bio;
    }

    const statNumbers = aboutContent.querySelectorAll('.stat-number');
    if (statNumbers.length >= 2) {
        statNumbers[0].textContent = aboutData.years_experience + '+';
        statNumbers[1].textContent = aboutData.projects_delivered + '+';
    }
}

function updateSkillsSection(skillsData) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = skillsData.map(skill => `
        <article class="skill-card">
            <div class="skill-icon">💻</div>
            <h3>${skill.title}</h3>
            <p>${skill.description}</p>
        </article>
    `).join('');
}

function updateProjectsSection(projectsData) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projectsData.map(project => `
        <article class="project-card">
            <div class="project-header">
                <h3>${project.title}</h3>
                <span class="project-status">${project.status}</span>
            </div>
            <p>${project.description}</p>
            <div class="project-tech">
                ${project.tech_tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
            </div>
        </article>
    `).join('');
}

function updateServicesSection(servicesData) {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = servicesData.map(service => `
        <article class="service-card">
            <div class="service-icon">⚙️</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            ${service.featured ? '<span class="featured-badge">Featured</span>' : ''}
        </article>
    `).join('');
}

function updateExperienceSection(experienceData) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    timeline.innerHTML = experienceData.map(exp => `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h3>${exp.title}</h3>
                <p class="timeline-company">${exp.role}</p>
                <p class="timeline-dates">${exp.dates}</p>
                <ul class="timeline-bullets">
                    ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function updateTestimonialsSection(testimonialsData) {
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (!testimonialsGrid) return;

    testimonialsGrid.innerHTML = testimonialsData.map(testimonial => `
        <article class="testimonial-card">
            <div class="testimonial-rating">
                ${'⭐'.repeat(testimonial.rating)}
            </div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">
                <strong>${testimonial.author_name}</strong>
                <span>${testimonial.author_role}</span>
            </div>
        </article>
    `).join('');
}

function observeNewElements() {
    document.querySelectorAll('.skill-card, .project-card, .service-card, .testimonial-card, .timeline-content').forEach(el => {
        if (!el.classList.contains('fade-in-up')) {
            el.style.opacity = '0';
            observer.observe(el);
        }
    });
}

// Initialize
initTheme();
updateActiveLink();

// Load portfolio data from backend when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPortfolioData);
} else {
    loadPortfolioData();
}
