const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'navachetana.raghu@gmail.com',
        pass: 'akhz jiyd wcen ehfj'
    }
});

const ADMIN_EMAIL = 'raghunandanmali1157@gmail.com';

function progressHTML(name, appId) {
    return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(135deg,#0d9488,#14b8a6);padding:30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;">Navachetana Livelihoods</h1>
            <p style="color:#d1fae5;margin:5px 0 0;">Private Limited</p>
        </div>
        <div style="padding:30px;">
            <h2 style="color:#1e293b;margin:0 0 15px;">Dear ${name},</h2>
            <p style="color:#475569;line-height:1.6;">Thank you for submitting your empanelment application with <strong>Navachetana Livelihoods Private Limited</strong>.</p>
            <div style="background:#f0fdfa;border-left:4px solid #0d9488;padding:15px;margin:20px 0;border-radius:0 8px 8px 0;">
                <p style="margin:0;color:#0f766e;font-weight:600;">Application ID: ${appId}</p>
                <p style="margin:5px 0 0;color:#0d9488;">Status: Under Review</p>
            </div>
            <p style="color:#475569;line-height:1.6;">Your application is currently <strong>under progress</strong>. Our operations team is reviewing your details. You will receive an email notification once your application is processed.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:25px 0;">
            <p style="color:#94a3b8;font-size:12px;text-align:center;">Navachetana Livelihoods Private Limited | Empowering Growth Through Microfinance</p>
        </div>
    </div>`;
}

function approvalHTML(name, appId, password) {
    return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:30px;text-align:center;">
            <div style="font-size:48px;margin-bottom:10px;">&#10003;</div>
            <h1 style="color:#fff;margin:0;font-size:24px;">Application Approved!</h1>
            <p style="color:#d1fae5;margin:5px 0 0;">Navachetana Livelihoods Private Limited</p>
        </div>
        <div style="padding:30px;">
            <h2 style="color:#1e293b;margin:0 0 15px;">Congratulations, ${name}!</h2>
            <p style="color:#475569;line-height:1.6;">Your empanelment application <strong>(${appId})</strong> has been <strong style="color:#059669;">approved</strong>. You can now log in to the Navachetana Agent Dashboard.</p>
            <div style="background:#f0fdfa;border:2px solid #6ee7b7;padding:20px;margin:25px 0;border-radius:12px;text-align:center;">
                <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">Your Login Credentials</p>
                <table style="margin:0 auto;text-align:left;">
                    <tr><td style="padding:5px 15px 5px 0;color:#64748b;">Login ID:</td><td style="padding:5px 0;color:#0f766e;font-weight:700;font-size:16px;font-family:monospace;">${appId}</td></tr>
                    <tr><td style="padding:5px 15px 5px 0;color:#64748b;">Password:</td><td style="padding:5px 0;color:#0f766e;font-weight:700;font-size:16px;font-family:monospace;">${password}</td></tr>
                </table>
            </div>
            <p style="color:#475569;line-height:1.6;">Use the <strong>"Agent Login"</strong> option on our website to access your dashboard.</p>
            <div style="text-align:center;margin:25px 0;">
                <p style="background:#fef3c7;color:#92400e;padding:10px 15px;border-radius:8px;font-size:13px;display:inline-block;">Keep your credentials safe and do not share them with anyone.</p>
            </div>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:25px 0;">
            <p style="color:#94a3b8;font-size:12px;text-align:center;">Navachetana Livelihoods Private Limited | Empowering Growth Through Microfinance</p>
        </div>
    </div>`;
}

function sentBackHTML(name, appId, reason) {
    return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;">Application Sent Back</h1>
            <p style="color:#fecaca;margin:5px 0 0;">Navachetana Livelihoods Private Limited</p>
        </div>
        <div style="padding:30px;">
            <h2 style="color:#1e293b;margin:0 0 15px;">Dear ${name},</h2>
            <p style="color:#475569;line-height:1.6;">Your empanelment application <strong>(${appId})</strong> has been sent back for the following reason:</p>
            <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:15px;margin:20px 0;border-radius:0 8px 8px 0;">
                <p style="margin:0;color:#991b1b;">${reason}</p>
            </div>
            <p style="color:#475569;line-height:1.6;">Please correct the issues and resubmit your application.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:25px 0;">
            <p style="color:#94a3b8;font-size:12px;text-align:center;">Navachetana Livelihoods Private Limited | Empowering Growth Through Microfinance</p>
        </div>
    </div>`;
}

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { type, email, name, app_id, password, reason } = req.body;

    if (!email || !type) {
        return res.status(400).json({ error: 'Missing email or type' });
    }

    try {
        let subject, html;

        if (type === 'progress') {
            subject = `Application Under Review - ${app_id} | Navachetana Livelihoods`;
            html = progressHTML(name, app_id);
            // Also notify admin
            await transporter.sendMail({
                from: '"Navachetana Livelihoods" <navachetana.raghu@gmail.com>',
                to: ADMIN_EMAIL,
                subject: `New Application: ${app_id} - ${name}`,
                html: `<div style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;"><h2 style="color:#0d9488;">New Empanelment Application</h2><p><strong>Name:</strong> ${name}</p><p><strong>App ID:</strong> ${app_id}</p><p><strong>Email:</strong> ${email}</p><p>Please log in to the Ops Dashboard to review.</p></div>`
            });
        } else if (type === 'approval') {
            subject = `Approved! Your Login Credentials - ${app_id} | Navachetana`;
            html = approvalHTML(name, app_id, password);
            await transporter.sendMail({
                from: '"Navachetana Livelihoods" <navachetana.raghu@gmail.com>',
                to: ADMIN_EMAIL,
                subject: `Approved: ${app_id} - ${name}`,
                html: `<div style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;"><h2 style="color:#059669;">Application Approved</h2><p><strong>${name}</strong> (${app_id}) approved. Credentials sent to ${email}.</p></div>`
            });
        } else if (type === 'sent_back') {
            subject = `Application Sent Back - ${app_id} | Navachetana`;
            html = sentBackHTML(name, app_id, reason);
        } else {
            return res.status(400).json({ error: 'Unknown email type' });
        }

        await transporter.sendMail({
            from: '"Navachetana Livelihoods" <navachetana.raghu@gmail.com>',
            to: email,
            subject,
            html
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Email error:', err);
        return res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
};
