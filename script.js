// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contactForm');
const statNumbers = document.querySelectorAll('.stat-number');
const loader = document.getElementById('loader');
const backToTop = document.getElementById('backToTop');
const faqItems = document.querySelectorAll('.faq-item');

// ===== Page Loader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
        }
        document.body.classList.add('loaded');
    }, 800);
});

// ===== Mobile Navigation Toggle =====
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (navToggle) {
            navToggle.classList.remove('active');
        }
    });
});

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    }

    // Show/hide back to top button
    if (backToTop) {
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    lastScroll = currentScroll;
});

// ===== Back to Top Button =====
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksItems.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
});

// ===== Animated Counter =====
function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

// Animate stats when in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ===== Fade In Animation on Scroll =====
const fadeElements = document.querySelectorAll('.service-card, .team-card, .info-card, .testimonial-card, .step-card, .feature-item');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    ...observerOptions,
    threshold: 0.1
});

fadeElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    fadeObserver.observe(element);
});

// ===== FAQ Accordion =====
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });

        // Open clicked item if it wasn't already open
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Contact Form Handling =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simple validation
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
            }
        });

        if (isValid) {
            // Show success message
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Message Sent!</span> ✓';
            submitBtn.style.backgroundColor = '#10b981';
            submitBtn.disabled = true;

            // Reset form
            contactForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);

            console.log('Form submitted:', data);
        }
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', () => {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// ===== Login Modal =====
const loginOverlay = document.getElementById('loginOverlay');
const loginClose = document.getElementById('loginClose');
const loginStep1 = document.getElementById('loginStep1');
const loginStep2 = document.getElementById('loginStep2');
const loginBack = document.getElementById('loginBack');
const loginForm = document.getElementById('loginForm');
const navLoginBtn = document.getElementById('nav-login-btn');
const navRefPartner = document.getElementById('nav-ref-partner');
const roleCards = document.querySelectorAll('.login-role-card');

function openLoginModal(preselectedRole) {
    if (loginOverlay) {
        loginOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (preselectedRole) {
            showLoginForm(preselectedRole);
        } else {
            loginStep1.classList.remove('hidden');
            loginStep2.classList.add('hidden');
        }
    }
}

function closeLoginModal() {
    if (loginOverlay) {
        loginOverlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            loginStep1.classList.remove('hidden');
            loginStep2.classList.add('hidden');
            if (loginForm) loginForm.reset();
        }, 300);
    }
}

function showLoginForm(role) {
    const titleEl = document.getElementById('loginRoleTitle');
    const subEl = document.getElementById('loginRoleSub');
    const iconEl = document.getElementById('loginRoleIcon');
    const idInput = document.getElementById('loginId');

    if (role === 'referral') {
        titleEl.textContent = 'Referral Partner Login';
        subEl.textContent = 'Enter your referral partner credentials';
        iconEl.textContent = '⚡';
        idInput.placeholder = 'e.g. NC-CON-2026-48231';
    } else {
        titleEl.textContent = 'Operational Manager Login';
        subEl.textContent = 'Enter your ops manager credentials';
        iconEl.textContent = '📊';
        idInput.placeholder = 'e.g. NV-OPS-001';
    }

    loginStep1.classList.add('hidden');
    loginStep2.classList.remove('hidden');
}

if (navLoginBtn) {
    navLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
    });
}

if (navRefPartner) {
    navRefPartner.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal('referral');
    });
}

if (loginClose) {
    loginClose.addEventListener('click', closeLoginModal);
}

if (loginOverlay) {
    loginOverlay.addEventListener('click', (e) => {
        if (e.target === loginOverlay) closeLoginModal();
    });
}

if (loginBack) {
    loginBack.addEventListener('click', () => {
        loginStep1.classList.remove('hidden');
        loginStep2.classList.add('hidden');
    });
}

roleCards.forEach(card => {
    card.addEventListener('click', () => {
        showLoginForm(card.dataset.role);
    });
});

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('loginId').value;
        const pass = document.getElementById('loginPass').value;
        if (id && pass) {
            const btn = document.getElementById('loginSubmitBtn');
            btn.textContent = 'Signing in...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Success ✓';
                btn.style.backgroundColor = '#10b981';
                setTimeout(() => {
                    closeLoginModal();
                    btn.textContent = 'Login';
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 800);
            }, 1200);
        }
    });
}

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginOverlay && loginOverlay.classList.contains('active')) {
        closeLoginModal();
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Navachetana Livelihoods Website Initialized');

    // Add animation classes after a short delay
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.add('aos-animate');
        });
    }, 100);
});
