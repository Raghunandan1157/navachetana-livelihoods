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

// ===== Email via Vercel API Route (fire-and-forget, 1 email per action) =====
function sendProgressEmail(name, email, appId) {
    if (!email) return;
    fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'progress', email: email, name: name, app_id: appId })
    }).catch(function() {});
}

function sendApprovalEmail(name, email, appId, password) {
    if (!email) return;
    fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'approval', email: email, name: name, app_id: appId, password: password })
    }).catch(function() {});
}

function sendSentBackEmail(name, email, appId, reason) {
    if (!email) return;
    fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sent_back', email: email, name: name, app_id: appId, reason: reason })
    }).catch(function() {});
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

    // Empannel button → load apps from DB then open page
    const empannelBtn = document.getElementById('empannelBtn');
    if (empannelBtn) {
        empannelBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            openPage(empannelPage);
            await loadEmpanelApps();
        });
    }

    // Load empanel applications from Supabase
    async function loadEmpanelApps() {
        const container = document.getElementById('empannelAppsList');
        if (!container || !supabaseClient) return;

        container.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:20px;">Loading applications...</p>';

        const { data: apps, error } = await supabaseClient
            .from('home_loan_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !apps || apps.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:20px;">No applications found. Start a new empanelment below!</p>';
            return;
        }

        container.innerHTML = apps.map(app => {
            const statusMap = {
                'pending': { icon: '&#9679;', text: 'Under Review', cls: '' },
                'approved': { icon: '&#10003;', text: 'Approved', cls: 'style="background:#ecfdf5;color:#059669;border-color:#6ee7b7;"' },
                'sent_back': { icon: '&#8617;', text: 'Sent Back', cls: 'style="background:#fef2f2;color:#dc2626;border-color:#fca5a5;"' }
            };
            const st = statusMap[app.status] || statusMap['pending'];
            const date = app.created_at ? app.created_at.split('T')[0] : '-';
            return `
                <div class="empannel-app-card" style="cursor:default;margin-bottom:10px;">
                    <div class="empannel-app-header">
                        <div class="empannel-app-info">
                            <div class="empannel-app-icon">&#128203;</div>
                            <div>
                                <div class="empannel-app-name">${app.name}</div>
                                <div class="empannel-app-id">${app.app_id}</div>
                            </div>
                        </div>
                        <span class="empannel-status-badge" ${st.cls}>${st.icon} ${st.text}</span>
                    </div>
                    <div class="empannel-app-footer">
                        <span class="empannel-app-date">Submitted ${date}</span>
                    </div>
                </div>
            `;
        }).join('');
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
        document.getElementById('detailEmail').textContent = app.email || '—';
        document.getElementById('detailPermAddress').textContent = app.permanent_address || app.address || '—';
        document.getElementById('detailCommAddress').textContent = app.communication_address || '—';
        document.getElementById('detailCompany').textContent = app.company || '—';
        document.getElementById('detailRef').textContent = app.ref_code || '—';
        document.getElementById('detailBank').textContent = app.bank_details || '—';
        document.getElementById('detailDate').textContent = app.created_at ? app.created_at.split('T')[0] : '—';

        // Render uploaded document links
        const docsContainer = document.getElementById('detailDocsContainer');
        const docFields = [
            { key: 'doc_aadhaar', label: 'Aadhaar Card' },
            { key: 'doc_pan', label: 'PAN Card' },
            { key: 'doc_bank', label: 'Bank Passbook' },
            { key: 'doc_udyam', label: 'Udyam Certificate' },
            { key: 'doc_gst', label: 'GST Certificate' },
        ];
        let docsHTML = '';
        docFields.forEach(d => {
            if (app[d.key]) {
                docsHTML += '<div class="ops-doc-link-row"><span class="ops-doc-link-name">' + d.label + '</span><a href="' + app[d.key] + '" target="_blank" class="ops-doc-link-btn">View</a></div>';
            }
        });
        docsContainer.innerHTML = docsHTML || '<p style="color:#94a3b8;font-size:13px;">No documents uploaded</p>';

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
        empanelFormBackBtn.addEventListener('click', () => {
            // Reset wizard to step 1 when closing
            empanelWizardStep = 1;
            empanelDocFiles = { aadhaar: null, pan: null, bank: null, udyam: null, gst: null };
            showEmpanelStep(1);
            closePage(empanelFormPage);
        });
    }

    // ===== Empanel Multi-Step Wizard =====
    let empanelWizardStep = 1;
    let empanelDocFiles = { aadhaar: null, pan: null, bank: null, udyam: null, gst: null };

    function showEmpanelStep(step) {
        empanelWizardStep = step;
        document.getElementById('empanelStep1').style.display = step === 1 ? '' : 'none';
        document.getElementById('empanelStep2').style.display = step === 2 ? '' : 'none';
        document.getElementById('empanelStep3').style.display = step === 3 ? '' : 'none';

        // Update progress bar
        document.querySelectorAll('.empanel-progress-step').forEach(el => {
            const s = parseInt(el.dataset.step);
            el.classList.remove('active', 'done');
            if (s === step) el.classList.add('active');
            else if (s < step) el.classList.add('done');
        });

        // Update subtitle
        const subtitles = {
            1: 'Fill in your details to begin onboarding',
            2: 'Upload your documents for verification',
            3: 'Review your details before submitting'
        };
        document.getElementById('empanelStepSubtitle').textContent = subtitles[step];

        // Re-animate
        const content = document.getElementById('empanelStep' + step);
        content.style.animation = 'none';
        content.offsetHeight; // trigger reflow
        content.style.animation = '';
    }

    // Step 1 validation
    function validateStep1() {
        const fields = ['ef_aadhaar', 'ef_pan', 'ef_name', 'ef_phone', 'ef_email', 'ef_perm_address', 'ef_comm_address', 'ef_company', 'ef_ref_code', 'ef_bank'];
        const allFilled = fields.every(id => {
            const el = document.getElementById(id);
            return el && el.value.trim() !== '';
        });
        const nextBtn = document.getElementById('empanelStep1Next');
        if (nextBtn) nextBtn.disabled = !allFilled;
    }

    // Add input listeners to all step 1 fields
    ['ef_aadhaar', 'ef_pan', 'ef_name', 'ef_phone', 'ef_email', 'ef_perm_address', 'ef_comm_address', 'ef_company', 'ef_ref_code', 'ef_bank'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', validateStep1);
    });

    // "Same as Permanent" button
    const sameAddrBtn = document.getElementById('efSameAddrBtn');
    if (sameAddrBtn) {
        sameAddrBtn.addEventListener('click', () => {
            document.getElementById('ef_comm_address').value = document.getElementById('ef_perm_address').value;
            validateStep1();
        });
    }

    // Step 1 → Step 2
    const step1Next = document.getElementById('empanelStep1Next');
    if (step1Next) {
        step1Next.addEventListener('click', () => showEmpanelStep(2));
    }

    // Step 2: Document upload slots
    function validateStep2() {
        const mandatoryDone = empanelDocFiles.aadhaar && empanelDocFiles.pan && empanelDocFiles.bank;
        const nextBtn = document.getElementById('empanelStep2Next');
        if (nextBtn) nextBtn.disabled = !mandatoryDone;
    }

    function updateDocSlotUI(docKey) {
        const slot = document.getElementById('docSlot_' + docKey);
        const file = empanelDocFiles[docKey];
        if (!slot) return;
        if (file) {
            slot.classList.add('uploaded');
            slot.querySelector('.empanel-doc-sublabel').textContent = file.name;
            slot.querySelector('.empanel-doc-action').innerHTML = '&#10003;';
        } else {
            slot.classList.remove('uploaded');
            slot.querySelector('.empanel-doc-sublabel').textContent = 'Tap to upload';
            slot.querySelector('.empanel-doc-action').textContent = '+';
        }
        validateStep2();
    }

    ['aadhaar', 'pan', 'bank', 'udyam', 'gst'].forEach(docKey => {
        const slot = document.getElementById('docSlot_' + docKey);
        const fileInput = document.getElementById('docFile_' + docKey);
        if (slot && fileInput) {
            slot.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    empanelDocFiles[docKey] = e.target.files[0];
                } else {
                    empanelDocFiles[docKey] = null;
                }
                updateDocSlotUI(docKey);
            });
        }
    });

    // Step 2 → back to Step 1
    const step2Back = document.getElementById('empanelStep2Back');
    if (step2Back) {
        step2Back.addEventListener('click', () => showEmpanelStep(1));
    }

    // Step 2 → Step 3 (Review)
    const step2Next = document.getElementById('empanelStep2Next');
    if (step2Next) {
        step2Next.addEventListener('click', () => {
            // Populate review fields
            document.getElementById('reviewAadhaar').textContent = document.getElementById('ef_aadhaar').value.trim();
            document.getElementById('reviewPan').textContent = document.getElementById('ef_pan').value.trim();
            document.getElementById('reviewName').textContent = document.getElementById('ef_name').value.trim();
            document.getElementById('reviewPhone').textContent = document.getElementById('ef_phone').value.trim();
            document.getElementById('reviewEmail').textContent = document.getElementById('ef_email').value.trim();
            document.getElementById('reviewPermAddr').textContent = document.getElementById('ef_perm_address').value.trim();
            document.getElementById('reviewCommAddr').textContent = document.getElementById('ef_comm_address').value.trim();
            document.getElementById('reviewCompany').textContent = document.getElementById('ef_company').value.trim();
            document.getElementById('reviewRef').textContent = document.getElementById('ef_ref_code').value.trim();
            document.getElementById('reviewBank').textContent = document.getElementById('ef_bank').value.trim();

            // Populate docs review
            const docsContainer = document.getElementById('reviewDocsContainer');
            const docNames = { aadhaar: 'Aadhaar Card', pan: 'PAN Card', bank: 'Bank Passbook', udyam: 'Udyam Certificate', gst: 'GST Certificate' };
            let docsHTML = '';
            Object.keys(empanelDocFiles).forEach(key => {
                if (empanelDocFiles[key]) {
                    docsHTML += '<div class="ops-detail-row"><span class="ops-detail-label">' + docNames[key] + '</span><span class="ops-detail-value" style="color:#059669;">&#10003; ' + empanelDocFiles[key].name + '</span></div>';
                }
            });
            docsContainer.innerHTML = docsHTML || '<p style="color:#94a3b8;font-size:13px;">No documents</p>';

            showEmpanelStep(3);
        });
    }

    // Step 3 → back to Step 2
    const step3Back = document.getElementById('empanelStep3Back');
    if (step3Back) {
        step3Back.addEventListener('click', () => showEmpanelStep(2));
    }

    // ===== Empanel form submit — saves to Supabase + uploads docs + sends email =====
    const empanelSubmitBtn = document.getElementById('empanelFormSubmitBtn');
    if (empanelSubmitBtn) {
        empanelSubmitBtn.addEventListener('click', async () => {
            const btn = empanelSubmitBtn;
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
                pan: document.getElementById('ef_pan').value.trim(),
                permanent_address: document.getElementById('ef_perm_address').value.trim(),
                communication_address: document.getElementById('ef_comm_address').value.trim(),
                company: document.getElementById('ef_company').value.trim(),
                ref_code: document.getElementById('ef_ref_code').value.trim(),
                bank_details: document.getElementById('ef_bank').value.trim(),
                status: 'pending'
            };

            try {
                // 1. Insert application row
                const { error } = await supabaseClient.from('home_loan_applications').insert([newApp]);
                if (error) {
                    alert('Error submitting application. Please try again.');
                    console.error('Supabase insert error:', error);
                    btn.textContent = 'Submit Application';
                    btn.disabled = false;
                    return;
                }

                // 2. Upload documents to Supabase Storage (fire-and-forget for each)
                const docKeys = ['aadhaar', 'pan', 'bank', 'udyam', 'gst'];
                const uploadedDocUrls = {};

                for (const key of docKeys) {
                    const file = empanelDocFiles[key];
                    if (!file) continue;
                    try {
                        const ext = file.name.split('.').pop();
                        const storagePath = 'empanel-docs/' + appId + '/' + key + '.' + ext;
                        const { error: uploadErr } = await supabaseClient.storage
                            .from('empanel-docs')
                            .upload(storagePath, file, { upsert: true });

                        if (!uploadErr) {
                            const { data: urlData } = supabaseClient.storage
                                .from('empanel-docs')
                                .getPublicUrl(storagePath);
                            uploadedDocUrls[key] = urlData?.publicUrl || storagePath;
                        }
                    } catch (e) {
                        console.warn('Doc upload failed for ' + key, e);
                    }
                }

                // 3. Update the row with doc URLs
                if (Object.keys(uploadedDocUrls).length > 0) {
                    await supabaseClient.from('home_loan_applications')
                        .update({
                            doc_aadhaar: uploadedDocUrls.aadhaar || null,
                            doc_pan: uploadedDocUrls.pan || null,
                            doc_bank: uploadedDocUrls.bank || null,
                            doc_udyam: uploadedDocUrls.udyam || null,
                            doc_gst: uploadedDocUrls.gst || null,
                        })
                        .eq('app_id', appId);
                }

                // 4. Send "under progress" email
                sendProgressEmail(applicantName, applicantEmail, appId);

                // 5. Reset form & wizard
                ['ef_aadhaar', 'ef_pan', 'ef_name', 'ef_phone', 'ef_email', 'ef_perm_address', 'ef_comm_address', 'ef_company', 'ef_ref_code', 'ef_bank'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                empanelDocFiles = { aadhaar: null, pan: null, bank: null, udyam: null, gst: null };
                ['aadhaar', 'pan', 'bank', 'udyam', 'gst'].forEach(k => updateDocSlotUI(k));
                empanelWizardStep = 1;
                showEmpanelStep(1);

                btn.textContent = 'Submit Application';
                btn.disabled = false;

                closePage(empanelFormPage);

                // Show success page
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

        // Create agent account in home_loan_empanel_agents table
        await supabaseClient.from('home_loan_empanel_agents').insert([{
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
                    .from('home_loan_empanel_agents')
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
            .from('home_loan_agent_customers')
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
                const { error } = await supabaseClient.from('home_loan_agent_customers').insert([customer]);

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
                .from('home_loan_empanel_agents')
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
