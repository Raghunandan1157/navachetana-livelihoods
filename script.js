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
function hideLoader() {
    var l = document.getElementById('loader');
    if (l) {
        l.style.opacity = '0';
        l.style.visibility = 'hidden';
        l.style.pointerEvents = 'none';
        setTimeout(function() { l.style.display = 'none'; }, 600);
    }
    document.body.classList.add('loaded');
}
// Hide loader on window load
window.addEventListener('load', function() { setTimeout(hideLoader, 800); });
// Failsafe: force hide after 2s no matter what
setTimeout(hideLoader, 2000);

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
        // Skip links inside the dropdown menu and the dropdown toggle itself
        if (this.closest('.nav-dropdown-menu') || this.classList.contains('nav-dropdown-toggle')) return;

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

// ===== Supabase Init =====
var SUPABASE_URL = 'https://zovnmmdfthpbubrorsgh.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvdm5tbWRmdGhwYnVicm9yc2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzE3ODgsImV4cCI6MjA3NzE0Nzc4OH0.92BH2sjUOgkw6iSRj1_4gt0p3eThg3QT4VK-Q4EdmBE';
var supabaseClient = null;
try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.warn('Supabase not ready yet, will retry on DOMContentLoaded');
}

// ===== EmailJS Config =====
// To set up EmailJS:
// 1. Create free account at https://www.emailjs.com
// 2. Add Gmail as email service (use navachetana.raghu@gmail.com)
// 3. Create email templates (progress, approval, sentback)
// 4. Update the IDs below
var EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';     // Replace after EmailJS setup
var EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';     // Replace after EmailJS setup
var EMAILJS_TEMPLATE_PROGRESS = 'YOUR_PROGRESS_TEMPLATE_ID';
var EMAILJS_TEMPLATE_APPROVAL = 'YOUR_APPROVAL_TEMPLATE_ID';
var EMAILJS_TEMPLATE_SENTBACK = 'YOUR_SENTBACK_TEMPLATE_ID';
var ADMIN_EMAIL = 'raghunandanmali1157@gmail.com';

// Initialize EmailJS
try {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
} catch(e) {
    console.warn('EmailJS init skipped');
}

function sendEmailJS(templateId, params) {
    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
        console.log('EmailJS not configured. Email would be sent to:', params.to_email, 'Template:', templateId);
        console.log('Email params:', params);
        return Promise.resolve(false);
    }
    return emailjs.send(EMAILJS_SERVICE_ID, templateId, params)
        .then(function() { console.log('Email sent'); return true; })
        .catch(function(err) { console.warn('Email error:', err); return false; });
}

function sendProgressEmail(name, email, appId) {
    if (!email) return;
    sendEmailJS(EMAILJS_TEMPLATE_PROGRESS, {
        to_email: email,
        to_name: name,
        app_id: appId,
        status: 'Under Review',
        admin_email: ADMIN_EMAIL
    });
}

function sendApprovalEmail(name, email, appId, password) {
    if (!email) return;
    sendEmailJS(EMAILJS_TEMPLATE_APPROVAL, {
        to_email: email,
        to_name: name,
        app_id: appId,
        password: password,
        admin_email: ADMIN_EMAIL
    });
}

function sendSentBackEmail(name, email, appId, reason) {
    if (!email) return;
    sendEmailJS(EMAILJS_TEMPLATE_SENTBACK, {
        to_email: email,
        to_name: name,
        app_id: appId,
        reason: reason,
        admin_email: ADMIN_EMAIL
    });
}

function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let pass = '';
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass;
}

// ===== Referal Agent - Login & Empannel =====
document.addEventListener('DOMContentLoaded', () => {
    // Retry Supabase init if it failed at top level
    if (!supabaseClient && window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        } catch (e) {
            console.error('Supabase init failed:', e);
        }
    }

    const loginModal = document.getElementById('loginModal');
    const empannelPage = document.getElementById('empannelPage');
    const opsPage = document.getElementById('opsPage');
    const loginForm = document.getElementById('loginForm');
    let selectedRole = 'empanel';
    let currentDetailAppId = null;

    function openPage(el) {
        if (!el) return;
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePage(el) {
        if (!el) return;
        el.classList.remove('active');
        const anyActive = [loginModal, empannelPage, opsPage, opsDetailPage,
            document.getElementById('empanelFormPage'), document.getElementById('empanelSuccessPage'),
            document.getElementById('agentLoginModal'), document.getElementById('agentDashboardPage')].some(
            p => p && p !== el && p.classList.contains('active')
        );
        if (!anyActive) {
            document.body.style.overflow = '';
        }
    }

    var opsDetailPage = document.getElementById('opsDetailPage');

    function showLoginStep(step) {
        const choose = document.getElementById('loginStepChoose');
        const form = document.getElementById('loginStepForm');
        if (choose) choose.style.display = step === 'choose' ? '' : 'none';
        if (form) form.style.display = step === 'form' ? '' : 'none';
    }

    function showLoginError(msg) {
        let errEl = document.getElementById('loginError');
        if (!errEl) {
            errEl = document.createElement('p');
            errEl.id = 'loginError';
            errEl.style.cssText = 'color:#dc2626;font-size:13px;margin-top:8px;text-align:center;';
            document.getElementById('loginForm').appendChild(errEl);
        }
        errEl.textContent = msg;
    }

    function clearLoginError() {
        const errEl = document.getElementById('loginError');
        if (errEl) errEl.textContent = '';
    }

    // Empannel button → go straight to Welcome Back page
    const empannelBtn = document.getElementById('empannelBtn');
    if (empannelBtn) {
        empannelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            openPage(empannelPage);
        });
    }

    // Login button → open login modal directly to form
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            selectedRole = 'ops';
            document.getElementById('loginRoleIcon').textContent = '📊';
            document.getElementById('loginRoleTitle').textContent = 'Operational Manager Login';
            document.getElementById('loginId').placeholder = 'e.g. NV-OPS-001';
            showLoginStep('form');
            clearLoginError();
            openPage(loginModal);
        });
    }

    // Modal close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            closePage(loginModal);
            showLoginStep('choose');
            clearLoginError();
            if (loginForm) loginForm.reset();
        });
    }

    // Click outside modal to close
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closePage(loginModal);
                showLoginStep('choose');
                clearLoginError();
                if (loginForm) loginForm.reset();
            }
        });
    }

    // Back buttons
    const empannelBackBtn = document.getElementById('empannelBackBtn');
    if (empannelBackBtn) empannelBackBtn.addEventListener('click', () => closePage(empannelPage));

    const opsBackBtn = document.getElementById('opsBackBtn');
    if (opsBackBtn) opsBackBtn.addEventListener('click', () => closePage(opsPage));

    // Role selection
    const roleEmpanel = document.getElementById('roleEmpanel');
    if (roleEmpanel) {
        roleEmpanel.addEventListener('click', () => {
            selectedRole = 'empanel';
            document.getElementById('loginRoleIcon').textContent = '⚡';
            document.getElementById('loginRoleTitle').textContent = 'Empanel Login';
            document.getElementById('loginId').placeholder = 'e.g. NC-CON-2026-48231';
            clearLoginError();
            showLoginStep('form');
        });
    }

    const roleOps = document.getElementById('roleOps');
    if (roleOps) {
        roleOps.addEventListener('click', () => {
            selectedRole = 'ops';
            document.getElementById('loginRoleIcon').textContent = '📊';
            document.getElementById('loginRoleTitle').textContent = 'Operational Manager Login';
            document.getElementById('loginId').placeholder = 'e.g. NV-OPS-001';
            clearLoginError();
            showLoginStep('form');
        });
    }

    // Back inside login form
    const loginBackBtn = document.getElementById('loginBackBtn');
    if (loginBackBtn) {
        loginBackBtn.addEventListener('click', () => {
            showLoginStep('choose');
            clearLoginError();
            if (loginForm) loginForm.reset();
        });
    }

    // ===== Login form submit — validates against Supabase =====
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('loginId').value.trim();
            const pass = document.getElementById('loginPassword').value.trim();
            if (!id || !pass) return;

            const btn = document.getElementById('loginSubmitBtn');
            btn.textContent = 'Signing in...';
            btn.classList.add('loading');
            btn.disabled = true;
            clearLoginError();

            try {
                // Query ops_managers table
                const { data, error } = await supabaseClient
                    .from('home_loan_ops_managers')
                    .select('*')
                    .eq('staff_id', id)
                    .eq('password', pass)
                    .single();

                if (error || !data) {
                    showLoginError('Invalid ID or password. Please try again.');
                    btn.textContent = 'Login';
                    btn.classList.remove('loading');
                    btn.disabled = false;
                    return;
                }

                // Login successful
                btn.textContent = 'Login';
                btn.classList.remove('loading');
                btn.disabled = false;
                loginForm.reset();
                closePage(loginModal);
                showLoginStep('choose');

                // Load applications from Supabase and open ops page
                await loadOpsApplications();
                openPage(opsPage);

            } catch (err) {
                showLoginError('Connection error. Please try again.');
                btn.textContent = 'Login';
                btn.classList.remove('loading');
                btn.disabled = false;
            }
        });
    }

    // ===== Load applications from Supabase into Ops dashboard =====
    async function loadOpsApplications() {
        const { data: apps, error } = await supabaseClient
            .from('home_loan_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !apps) return;

        const container = document.getElementById('opsAppList');
        if (!container) return;

        container.innerHTML = '';
        apps.forEach(app => {
            const statusMap = {
                'pending': { icon: '●', text: 'Pending', cls: 'pending' },
                'approved': { icon: '✓', text: 'Approved', cls: 'approved' },
                'sent_back': { icon: '↩', text: 'Sent Back', cls: 'sent-back' }
            };
            const st = statusMap[app.status] || statusMap['pending'];

            const row = document.createElement('div');
            row.className = 'ops-app-row';
            row.dataset.appid = app.app_id;
            row.innerHTML = `
                <div class="ops-app-name">${app.name}</div>
                <div class="ops-app-id">${app.app_id}</div>
                <div class="ops-app-status ${st.cls}">${st.icon} ${st.text}</div>
            `;
            row.addEventListener('click', () => openAppDetail(app));
            container.appendChild(row);
        });
    }

    // ===== Open application detail =====
    function openAppDetail(app) {
        currentDetailAppId = app.app_id;

        document.getElementById('detailName').textContent = app.name;
        document.getElementById('detailId').textContent = app.app_id;
        document.getElementById('detailAadhaar').textContent = app.aadhaar || '—';
        document.getElementById('detailPan').textContent = app.pan || '—';
        document.getElementById('detailPhone').textContent = app.phone || '—';
        document.getElementById('detailAddress').textContent = app.address || '—';
        document.getElementById('detailCompany').textContent = app.company || '—';
        document.getElementById('detailRef').textContent = app.ref_code || '—';
        document.getElementById('detailDate').textContent = app.created_at ? app.created_at.split('T')[0] : '—';
        document.getElementById('detailBank').textContent = app.bank_details || '—';
        document.getElementById('detailUdyam').textContent = app.udyam || '—';
        document.getElementById('detailGst').textContent = app.gst || '—';

        // Set status badge based on current status
        const detailStatus = document.getElementById('detailStatus');
        if (app.status === 'approved') {
            detailStatus.textContent = '✓ Approved';
            detailStatus.style.background = '#ecfdf5';
            detailStatus.style.borderColor = '#6ee7b7';
            detailStatus.style.color = '#059669';
            document.getElementById('opsActionBtns').style.display = 'none';
        } else if (app.status === 'sent_back') {
            detailStatus.textContent = '↩ Sent Back';
            detailStatus.style.background = '#fef2f2';
            detailStatus.style.borderColor = '#fca5a5';
            detailStatus.style.color = '#dc2626';
            document.getElementById('opsActionBtns').style.display = 'none';
        } else {
            detailStatus.textContent = '⏳ Pending Review';
            detailStatus.style.background = '';
            detailStatus.style.borderColor = '';
            detailStatus.style.color = '';
            document.getElementById('opsActionBtns').style.display = 'flex';
        }

        document.getElementById('opsSendBackForm').style.display = 'none';
        document.getElementById('sendBackMsg').value = '';

        openPage(opsDetailPage);
    }

    // Escape key — close topmost overlay only
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (opsDetailPage && opsDetailPage.classList.contains('active')) {
                closePage(opsDetailPage);
            } else if (loginModal && loginModal.classList.contains('active')) {
                closePage(loginModal);
                showLoginStep('choose');
                clearLoginError();
                if (loginForm) loginForm.reset();
            } else if (empannelPage && empannelPage.classList.contains('active')) {
                closePage(empannelPage);
            } else if (opsPage && opsPage.classList.contains('active')) {
                closePage(opsPage);
            }
        }
    });

    // Empannel page actions
    const empannelViewDetails = document.getElementById('empannelViewDetails');
    if (empannelViewDetails) {
        empannelViewDetails.addEventListener('click', () => {
            alert('Viewing application details for NC-CON-2026-48231');
        });
    }

    const empannelNewBtn = document.getElementById('empannelNewBtn');
    const empanelFormPage = document.getElementById('empanelFormPage');
    const empanelSuccessPage = document.getElementById('empanelSuccessPage');

    if (empannelNewBtn) {
        empannelNewBtn.addEventListener('click', () => {
            openPage(empanelFormPage);
        });
    }

    const empanelFormBackBtn = document.getElementById('empanelFormBackBtn');
    if (empanelFormBackBtn) {
        empanelFormBackBtn.addEventListener('click', () => closePage(empanelFormPage));
    }

    // ===== Empanel form submit — saves to Supabase + sends email =====
    const empanelForm = document.getElementById('empanelForm');
    if (empanelForm) {
        empanelForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('empanelFormSubmitBtn');
            btn.textContent = 'Submitting...';
            btn.disabled = true;

            // Generate app ID
            const appId = 'NC-CON-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 99999)).padStart(5, '0');

            const applicantName = document.getElementById('ef_name').value.trim();
            const applicantEmail = document.getElementById('ef_email').value.trim() || null;

            const newApp = {
                app_id: appId,
                name: applicantName,
                phone: document.getElementById('ef_phone').value.trim(),
                email: applicantEmail,
                aadhaar: document.getElementById('ef_aadhaar').value.trim(),
                pan: document.getElementById('ef_pan').value.trim() || null,
                address: document.getElementById('ef_address').value.trim(),
                company: document.getElementById('ef_company').value.trim() || null,
                status: 'pending'
            };

            try {
                const { error } = await supabaseClient.from('home_loan_applications').insert([newApp]);

                btn.textContent = 'Submit Application';
                btn.disabled = false;

                if (error) {
                    alert('Error submitting application. Please try again.');
                    console.error('Supabase insert error:', error);
                    return;
                }

                // Send "under progress" email
                sendProgressEmail(applicantName, applicantEmail, appId);

                empanelForm.reset();
                closePage(empanelFormPage);

                // Update success page with the new app ID
                const successIdEl = document.getElementById('empanelSuccessId');
                if (successIdEl) successIdEl.textContent = appId;
                openPage(empanelSuccessPage);

            } catch (err) {
                btn.textContent = 'Submit Application';
                btn.disabled = false;
                alert('Connection error. Please try again.');
            }
        });
    }

    const empanelSuccessBackBtn = document.getElementById('empanelSuccessBackBtn');
    if (empanelSuccessBackBtn) {
        empanelSuccessBackBtn.addEventListener('click', () => {
            closePage(empanelSuccessPage);
            closePage(empannelPage);
        });
    }

    // Dropdown toggle
    const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    const navDropdown = document.querySelector('.nav-dropdown');
    if (dropdownToggle && navDropdown) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            navDropdown.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!navDropdown.contains(e.target)) {
                navDropdown.classList.remove('open');
            }
        });
    }

    // ===== Ops Detail - Back =====
    const opsDetailBackBtn = document.getElementById('opsDetailBackBtn');
    if (opsDetailBackBtn) {
        opsDetailBackBtn.addEventListener('click', () => {
            closePage(opsDetailPage);
        });
    }

    // ===== Ops Approve — updates Supabase + creates agent credentials + sends email =====
    document.getElementById('opsApproveBtn').addEventListener('click', async () => {
        if (!currentDetailAppId) return;

        const approveBtn = document.getElementById('opsApproveBtn');
        approveBtn.textContent = 'Approving...';
        approveBtn.disabled = true;

        // Get the application details
        const { data: appData } = await supabaseClient
            .from('home_loan_applications')
            .select('*')
            .eq('app_id', currentDetailAppId)
            .single();

        // Generate a random password
        const generatedPassword = generatePassword();

        // Update application status
        const { error } = await supabaseClient
            .from('home_loan_applications')
            .update({ status: 'approved' })
            .eq('app_id', currentDetailAppId);

        if (error) {
            alert('Error approving. Please try again.');
            approveBtn.textContent = '✓ Approve';
            approveBtn.disabled = false;
            return;
        }

        // Create agent account in empanel_agents table
        await supabaseClient.from('empanel_agents').insert([{
            app_id: currentDetailAppId,
            password: generatedPassword,
            name: appData?.name || 'Agent',
            email: appData?.email || null,
            phone: appData?.phone || null
        }]);

        // Send approval email with credentials
        sendApprovalEmail(appData?.name || 'Agent', appData?.email, currentDetailAppId, generatedPassword);

        approveBtn.textContent = '✓ Approve';
        approveBtn.disabled = false;

        document.getElementById('opsActionBtns').style.display = 'none';
        document.getElementById('detailStatus').textContent = '✓ Approved';
        document.getElementById('detailStatus').style.background = '#ecfdf5';
        document.getElementById('detailStatus').style.borderColor = '#6ee7b7';
        document.getElementById('detailStatus').style.color = '#059669';

        // Refresh the list behind
        await loadOpsApplications();
    });

    // ===== Ops Send Back =====
    document.getElementById('opsSendBackBtn').addEventListener('click', () => {
        document.getElementById('opsActionBtns').style.display = 'none';
        document.getElementById('opsSendBackForm').style.display = 'block';
    });

    document.getElementById('opsSendBackSubmit').addEventListener('click', async () => {
        const msg = document.getElementById('sendBackMsg').value.trim();
        if (!msg || !currentDetailAppId) return;

        // Get app details for email
        const { data: appData } = await supabaseClient
            .from('home_loan_applications')
            .select('*')
            .eq('app_id', currentDetailAppId)
            .single();

        const { error } = await supabaseClient
            .from('home_loan_applications')
            .update({ status: 'sent_back', send_back_reason: msg })
            .eq('app_id', currentDetailAppId);

        if (error) {
            alert('Error sending back. Please try again.');
            return;
        }

        // Send "sent back" email
        sendSentBackEmail(appData?.name || 'Applicant', appData?.email, currentDetailAppId, msg);

        document.getElementById('opsSendBackForm').style.display = 'none';
        document.getElementById('detailStatus').textContent = '↩ Sent Back';
        document.getElementById('detailStatus').style.background = '#fef2f2';
        document.getElementById('detailStatus').style.borderColor = '#fca5a5';
        document.getElementById('detailStatus').style.color = '#dc2626';

        // Refresh the list behind
        await loadOpsApplications();
    });

    document.getElementById('opsSendBackCancel').addEventListener('click', () => {
        document.getElementById('opsSendBackForm').style.display = 'none';
        document.getElementById('opsActionBtns').style.display = 'flex';
    });

    // ===== Agent Login & Dashboard =====
    const agentLoginModal = document.getElementById('agentLoginModal');
    const agentDashboardPage = document.getElementById('agentDashboardPage');
    const agentLoginForm = document.getElementById('agentLoginForm');
    let currentAgent = null;

    // Agent Login button
    const agentLoginBtn = document.getElementById('agentLoginBtn');
    if (agentLoginBtn) {
        agentLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            openPage(agentLoginModal);
        });
    }

    // Agent modal close
    const agentModalClose = document.getElementById('agentModalClose');
    if (agentModalClose) {
        agentModalClose.addEventListener('click', () => {
            closePage(agentLoginModal);
            if (agentLoginForm) agentLoginForm.reset();
        });
    }
    if (agentLoginModal) {
        agentLoginModal.addEventListener('click', (e) => {
            if (e.target === agentLoginModal) {
                closePage(agentLoginModal);
                if (agentLoginForm) agentLoginForm.reset();
            }
        });
    }

    // Agent Login Form Submit
    if (agentLoginForm) {
        agentLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('agentLoginId').value.trim();
            const pass = document.getElementById('agentLoginPassword').value.trim();
            if (!id || !pass) return;

            const btn = document.getElementById('agentLoginSubmitBtn');
            btn.textContent = 'Signing in...';
            btn.disabled = true;

            // Remove old error
            const oldErr = document.getElementById('agentLoginError');
            if (oldErr) oldErr.remove();

            try {
                const { data, error } = await supabaseClient
                    .from('empanel_agents')
                    .select('*')
                    .eq('app_id', id)
                    .eq('password', pass)
                    .single();

                if (error || !data) {
                    const errEl = document.createElement('p');
                    errEl.id = 'agentLoginError';
                    errEl.style.cssText = 'color:#dc2626;font-size:13px;margin-top:8px;text-align:center;';
                    errEl.textContent = 'Invalid Agent ID or password. Please try again.';
                    agentLoginForm.appendChild(errEl);
                    btn.textContent = 'Login';
                    btn.disabled = false;
                    return;
                }

                // Successful login
                currentAgent = data;
                btn.textContent = 'Login';
                btn.disabled = false;
                agentLoginForm.reset();
                closePage(agentLoginModal);

                // Populate and open dashboard
                initAgentDashboard(data);
                openPage(agentDashboardPage);

            } catch (err) {
                const errEl = document.createElement('p');
                errEl.id = 'agentLoginError';
                errEl.style.cssText = 'color:#dc2626;font-size:13px;margin-top:8px;text-align:center;';
                errEl.textContent = 'Connection error. Please try again.';
                agentLoginForm.appendChild(errEl);
                btn.textContent = 'Login';
                btn.disabled = false;
            }
        });
    }

    // ===== Agent Dashboard Init =====
    function initAgentDashboard(agent) {
        currentAgent = agent;
        const initial = (agent.name || 'A').charAt(0).toUpperCase();

        const els = {
            'agentWelcomeName': agent.name,
            'agentTopbarName': agent.name,
            'agentProfileName': agent.name,
            'agentProfileId': agent.app_id,
            'agentProfileEmail': agent.email || '-',
            'agentProfilePhone': agent.phone || '-',
            'agentProfileJoined': agent.created_at ? agent.created_at.split('T')[0] : '-',
        };
        for (const [id, val] of Object.entries(els)) {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        }
        const avatarEls = ['agentTopbarAvatar', 'agentProfileAvatar'];
        avatarEls.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = initial;
        });

        loadAgentCustomers();
    }

    // ===== Tab Navigation =====
    document.querySelectorAll('.agent-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.agent-nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.agent-tab').forEach(t => t.classList.remove('active'));
            const target = document.getElementById('tab-' + tab);
            if (target) target.classList.add('active');

            const titles = { 'dashboard': 'Dashboard', 'add-customer': 'Add Customer', 'customers': 'My Customers', 'profile': 'My Profile' };
            const topTitle = document.querySelector('.agent-topbar-title');
            if (topTitle) topTitle.textContent = titles[tab] || 'Dashboard';

            const sidebar = document.querySelector('.agent-sidebar');
            if (sidebar) sidebar.classList.remove('open');
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('agentMenuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.agent-sidebar').classList.toggle('open');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('agentLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentAgent = null;
            closePage(agentDashboardPage);
            document.querySelectorAll('.agent-nav-item').forEach(b => b.classList.remove('active'));
            document.querySelector('.agent-nav-item[data-tab="dashboard"]')?.classList.add('active');
            document.querySelectorAll('.agent-tab').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-dashboard')?.classList.add('active');
        });
    }

    // ===== Load Agent Customers =====
    async function loadAgentCustomers() {
        if (!currentAgent) return;

        const { data: customers, error } = await supabaseClient
            .from('agent_customers')
            .select('*')
            .eq('agent_app_id', currentAgent.app_id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading customers:', error);
            return;
        }

        const list = customers || [];

        document.getElementById('agentStatTotal').textContent = list.length;
        document.getElementById('agentStatProcessing').textContent = list.filter(c => c.status === 'processing' || c.status === 'submitted').length;
        document.getElementById('agentStatApproved').textContent = list.filter(c => c.status === 'approved').length;
        const totalAmount = list.reduce((sum, c) => sum + (parseFloat(c.loan_amount) || 0), 0);
        document.getElementById('agentStatAmount').textContent = totalAmount >= 100000 ? (totalAmount / 100000).toFixed(1) + 'L' : totalAmount.toLocaleString('en-IN');

        const recentEl = document.getElementById('agentRecentList');
        if (recentEl) {
            if (list.length === 0) {
                recentEl.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:30px;">No customers yet. Add your first customer!</p>';
            } else {
                recentEl.innerHTML = list.slice(0, 5).map(c => renderCustomerRow(c)).join('');
            }
        }

        renderFilteredCustomers(list);
    }

    function renderCustomerRow(c) {
        const statusColors = {
            'submitted': { bg: '#dbeafe', color: '#2563eb', label: 'Submitted' },
            'processing': { bg: '#fef3c7', color: '#d97706', label: 'Processing' },
            'approved': { bg: '#d1fae5', color: '#059669', label: 'Approved' },
            'rejected': { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' }
        };
        const st = statusColors[c.status] || statusColors['submitted'];
        const amount = c.loan_amount ? '\u20B9' + parseFloat(c.loan_amount).toLocaleString('en-IN') : '-';
        return `
            <div class="agent-customer-row">
                <div class="agent-customer-info">
                    <div class="agent-customer-name">${c.customer_name}</div>
                    <div class="agent-customer-meta">${c.customer_id} · ${c.loan_purpose || '-'} · ${amount}</div>
                </div>
                <span class="agent-customer-status" style="background:${st.bg};color:${st.color};">${st.label}</span>
            </div>
        `;
    }

    function renderFilteredCustomers(allCustomers) {
        const container = document.getElementById('agentCustomersList');
        if (!container) return;

        const filterStatus = document.getElementById('agentFilterStatus');
        const searchInput = document.getElementById('agentSearchCustomer');

        function render() {
            let filtered = allCustomers;
            const status = filterStatus?.value || 'all';
            const query = (searchInput?.value || '').toLowerCase();

            if (status !== 'all') {
                filtered = filtered.filter(c => c.status === status);
            }
            if (query) {
                filtered = filtered.filter(c =>
                    c.customer_name.toLowerCase().includes(query) ||
                    c.customer_id.toLowerCase().includes(query)
                );
            }

            if (filtered.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:40px;">No customers found.</p>';
            } else {
                container.innerHTML = filtered.map(c => renderCustomerRow(c)).join('');
            }
        }

        if (filterStatus) filterStatus.addEventListener('change', render);
        if (searchInput) searchInput.addEventListener('input', render);
        render();
    }

    // ===== Add Customer Form =====
    const addCustomerForm = document.getElementById('addCustomerForm');
    if (addCustomerForm) {
        addCustomerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentAgent) return;

            const btn = document.getElementById('addCustomerSubmitBtn');
            btn.textContent = 'Submitting...';
            btn.disabled = true;

            const customerId = 'CUS-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 99999)).padStart(5, '0');

            const customer = {
                customer_id: customerId,
                agent_app_id: currentAgent.app_id,
                customer_name: document.getElementById('cf_name').value.trim(),
                phone: document.getElementById('cf_phone').value.trim(),
                email: document.getElementById('cf_email').value.trim() || null,
                aadhaar: document.getElementById('cf_aadhaar').value.trim() || null,
                pan: document.getElementById('cf_pan').value.trim() || null,
                address: document.getElementById('cf_address').value.trim(),
                loan_amount: parseFloat(document.getElementById('cf_loan_amount').value) || null,
                loan_purpose: document.getElementById('cf_loan_purpose').value,
                employment_type: document.getElementById('cf_employment').value,
                monthly_income: parseFloat(document.getElementById('cf_income').value) || null,
                notes: document.getElementById('cf_notes').value.trim() || null,
                status: 'submitted'
            };

            try {
                const { error } = await supabaseClient.from('agent_customers').insert([customer]);

                btn.textContent = 'Submit Customer';
                btn.disabled = false;

                if (error) {
                    alert('Error adding customer. Please try again.');
                    console.error('Insert error:', error);
                    return;
                }

                addCustomerForm.reset();
                alert('Customer ' + customerId + ' added successfully!');
                await loadAgentCustomers();

                // Switch to customers tab
                document.querySelectorAll('.agent-nav-item').forEach(b => b.classList.remove('active'));
                document.querySelector('.agent-nav-item[data-tab="customers"]')?.classList.add('active');
                document.querySelectorAll('.agent-tab').forEach(t => t.classList.remove('active'));
                document.getElementById('tab-customers')?.classList.add('active');
                document.querySelector('.agent-topbar-title').textContent = 'My Customers';

            } catch (err) {
                btn.textContent = 'Submit Customer';
                btn.disabled = false;
                alert('Connection error. Please try again.');
            }
        });
    }

    // ===== Change Password Form =====
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentAgent) return;

            const current = document.getElementById('cp_current').value;
            const newPass = document.getElementById('cp_new').value;
            const confirm = document.getElementById('cp_confirm').value;

            if (current !== currentAgent.password) {
                alert('Current password is incorrect.');
                return;
            }
            if (newPass !== confirm) {
                alert('New passwords do not match.');
                return;
            }
            if (newPass.length < 6) {
                alert('Password must be at least 6 characters.');
                return;
            }

            const { error } = await supabaseClient
                .from('empanel_agents')
                .update({ password: newPass })
                .eq('app_id', currentAgent.app_id);

            if (error) {
                alert('Error updating password.');
                return;
            }

            currentAgent.password = newPass;
            changePasswordForm.reset();
            alert('Password updated successfully!');
        });
    }

    // ===== Initialize =====
    console.log('Navachetana Livelihoods Website Initialized');
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.add('aos-animate');
        });
    }, 100);
});
