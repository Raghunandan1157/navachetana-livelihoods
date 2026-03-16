"""
Minimal Flask server for Navachetana Livelihoods.
Serves static files and provides email-sending API endpoints.
"""

import os
import smtplib
import secrets
import string
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

# ─── SMTP Config (from Greetings project) ───
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "navachetana.raghu@gmail.com"
APP_PASSWORD = "akhz jiyd wcen ehfj"

# ─── Admin notification email ───
ADMIN_EMAIL = "raghunandanmali1157@gmail.com"


def send_email(to_email, subject, body_html):
    """Send an email via Gmail SMTP."""
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"Navachetana Livelihoods <{SENDER_EMAIL}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body_html, "html", "utf-8"))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


def generate_password(length=8):
    """Generate a random password."""
    chars = string.ascii_letters + string.digits
    return "".join(secrets.choice(chars) for _ in range(length))


# ─── Serve static files ───
@app.route("/")
def index():
    return send_from_directory(".", "index.html")


# ─── API: Send "Application Under Progress" email ───
@app.route("/api/send-progress-email", methods=["POST"])
def send_progress_email():
    data = request.json
    applicant_email = data.get("email")
    applicant_name = data.get("name", "Applicant")
    app_id = data.get("app_id", "")

    if not applicant_email:
        return jsonify({"ok": False, "error": "No email provided"}), 400

    # Email to applicant
    applicant_html = f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Navachetana Livelihoods</h1>
            <p style="color: #d1fae5; margin: 5px 0 0;">Private Limited</p>
        </div>
        <div style="padding: 30px;">
            <h2 style="color: #1e293b; margin: 0 0 15px;">Dear {applicant_name},</h2>
            <p style="color: #475569; line-height: 1.6;">
                Thank you for submitting your empanelment application with <strong>Navachetana Livelihoods Private Limited</strong>.
            </p>
            <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #0f766e; font-weight: 600;">Application ID: {app_id}</p>
                <p style="margin: 5px 0 0; color: #0d9488;">Status: Under Review</p>
            </div>
            <p style="color: #475569; line-height: 1.6;">
                Your application is currently <strong>under progress</strong>. Our operations team is reviewing your details.
                You will receive an email notification once your application is processed.
            </p>
            <p style="color: #475569; line-height: 1.6;">
                Please do not reply to this email. For queries, contact our office directly.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                Navachetana Livelihoods Private Limited | Empowering Growth Through Microfinance
            </p>
        </div>
    </div>
    """

    # Email to admin
    admin_html = f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Empanelment Application</h1>
        </div>
        <div style="padding: 25px;">
            <p style="color: #475569;">A new empanelment application has been submitted:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                <tr><td style="padding: 8px; color: #94a3b8; border-bottom: 1px solid #f1f5f9;">Name</td><td style="padding: 8px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">{applicant_name}</td></tr>
                <tr><td style="padding: 8px; color: #94a3b8; border-bottom: 1px solid #f1f5f9;">App ID</td><td style="padding: 8px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">{app_id}</td></tr>
                <tr><td style="padding: 8px; color: #94a3b8; border-bottom: 1px solid #f1f5f9;">Email</td><td style="padding: 8px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #f1f5f9;">{applicant_email}</td></tr>
            </table>
            <p style="color: #475569;">Please log in to the Ops Dashboard to review this application.</p>
        </div>
    </div>
    """

    ok1 = send_email(applicant_email, f"Application Under Review - {app_id} | Navachetana Livelihoods", applicant_html)
    ok2 = send_email(ADMIN_EMAIL, f"New Application: {app_id} - {applicant_name}", admin_html)

    return jsonify({"ok": ok1, "admin_notified": ok2})


# ─── API: Send "Application Approved" email with credentials ───
@app.route("/api/send-approval-email", methods=["POST"])
def send_approval_email():
    data = request.json
    applicant_email = data.get("email")
    applicant_name = data.get("name", "Applicant")
    app_id = data.get("app_id", "")
    password = data.get("password", "")

    if not applicant_email:
        return jsonify({"ok": False, "error": "No email provided"}), 400

    html = f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">&#10003;</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Approved!</h1>
            <p style="color: #d1fae5; margin: 5px 0 0;">Navachetana Livelihoods Private Limited</p>
        </div>
        <div style="padding: 30px;">
            <h2 style="color: #1e293b; margin: 0 0 15px;">Congratulations, {applicant_name}!</h2>
            <p style="color: #475569; line-height: 1.6;">
                Your empanelment application <strong>({app_id})</strong> has been <strong style="color: #059669;">approved</strong>.
                You can now log in to the Navachetana Agent Dashboard to manage your customers and monitor activity.
            </p>
            <div style="background: #f0fdfa; border: 2px solid #6ee7b7; padding: 20px; margin: 25px 0; border-radius: 12px; text-align: center;">
                <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px;">Your Login Credentials</p>
                <table style="margin: 0 auto; text-align: left;">
                    <tr>
                        <td style="padding: 5px 15px 5px 0; color: #64748b;">Login ID:</td>
                        <td style="padding: 5px 0; color: #0f766e; font-weight: 700; font-size: 16px; font-family: monospace;">{app_id}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 15px 5px 0; color: #64748b;">Password:</td>
                        <td style="padding: 5px 0; color: #0f766e; font-weight: 700; font-size: 16px; font-family: monospace;">{password}</td>
                    </tr>
                </table>
            </div>
            <p style="color: #475569; line-height: 1.6;">
                Please use the <strong>"Agent Login"</strong> option on our website to access your dashboard.
                We recommend changing your password after your first login.
            </p>
            <div style="text-align: center; margin: 25px 0;">
                <p style="background: #fef3c7; color: #92400e; padding: 10px 15px; border-radius: 8px; font-size: 13px; display: inline-block;">
                    Keep your credentials safe and do not share them with anyone.
                </p>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                Navachetana Livelihoods Private Limited | Empowering Growth Through Microfinance
            </p>
        </div>
    </div>
    """

    # Also notify admin
    admin_html = f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px;">
        <h2 style="color: #059669;">Application Approved</h2>
        <p><strong>{applicant_name}</strong> ({app_id}) has been approved.</p>
        <p>Login credentials have been sent to {applicant_email}.</p>
    </div>
    """

    ok1 = send_email(applicant_email, f"Approved! Your Login Credentials - {app_id} | Navachetana", html)
    ok2 = send_email(ADMIN_EMAIL, f"Approved: {app_id} - {applicant_name}", admin_html)

    return jsonify({"ok": ok1, "admin_notified": ok2, "password": password})


# ─── API: Send status update email ───
@app.route("/api/send-status-email", methods=["POST"])
def send_status_email():
    data = request.json
    applicant_email = data.get("email")
    applicant_name = data.get("name", "Applicant")
    app_id = data.get("app_id", "")
    status = data.get("status", "")
    reason = data.get("reason", "")

    if not applicant_email:
        return jsonify({"ok": False, "error": "No email provided"}), 400

    if status == "sent_back":
        html = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Sent Back</h1>
                <p style="color: #fecaca; margin: 5px 0 0;">Navachetana Livelihoods Private Limited</p>
            </div>
            <div style="padding: 30px;">
                <h2 style="color: #1e293b; margin: 0 0 15px;">Dear {applicant_name},</h2>
                <p style="color: #475569; line-height: 1.6;">
                    Your empanelment application <strong>({app_id})</strong> has been sent back for the following reason:
                </p>
                <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #991b1b;">{reason}</p>
                </div>
                <p style="color: #475569; line-height: 1.6;">
                    Please correct the issues and resubmit your application. Contact our office for assistance.
                </p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                    Navachetana Livelihoods Private Limited | Empowering Growth Through Microfinance
                </p>
            </div>
        </div>
        """
        ok = send_email(applicant_email, f"Application Sent Back - {app_id} | Navachetana", html)
        return jsonify({"ok": ok})

    return jsonify({"ok": False, "error": "Unknown status"}), 400


# ─── API: Generate password ───
@app.route("/api/generate-password", methods=["GET"])
def gen_password():
    return jsonify({"password": generate_password()})


if __name__ == "__main__":
    print("Starting Navachetana server on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
