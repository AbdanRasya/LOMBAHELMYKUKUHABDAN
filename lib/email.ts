import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "PUSAKA <noreply@pusaka.id>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// â”€â”€â”€ Email Templates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function verificationEmailHtml(name: string, token: string) {
  const url = `${APP_URL}/verify-email?token=${token}`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;padding:40px 20px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;border:1px solid #e2e8f0">
    <div style="text-align:center;margin-bottom:32px">
      <div style="display:inline-flex;align-items:center;gap:8px">
        <div style="width:32px;height:32px;background:#059669;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">S</div>
        <span style="font-size:20px;font-weight:700;color:#0f172a">PUSAKA</span>
      </div>
    </div>
    <h1 style="font-size:24px;font-weight:700;color:#0f172a;margin:0 0 8px">Verifikasi Email Anda</h1>
    <p style="color:#64748b;margin:0 0 24px">Hai ${name}, terima kasih sudah mendaftar di PUSAKA! Klik tombol di bawah untuk memverifikasi alamat email Anda.</p>
    <a href="${url}" style="display:block;background:#059669;color:#fff;text-align:center;padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:24px">
      Verifikasi Email Sekarang
    </a>
    <p style="color:#94a3b8;font-size:13px;margin:0">Link ini valid selama 24 jam. Jika Anda tidak mendaftar, abaikan email ini.</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
    <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center">Â© 2025 PUSAKA. Platform B2B Indonesia.</p>
  </div>
</body>
</html>`;
}

function passwordResetEmailHtml(name: string, token: string) {
  const url = `${APP_URL}/reset-password?token=${token}`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;padding:40px 20px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;border:1px solid #e2e8f0">
    <div style="text-align:center;margin-bottom:32px">
      <div style="display:inline-flex;align-items:center;gap:8px">
        <div style="width:32px;height:32px;background:#059669;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold">S</div>
        <span style="font-size:20px;font-weight:700;color:#0f172a">PUSAKA</span>
      </div>
    </div>
    <h1 style="font-size:24px;font-weight:700;color:#0f172a;margin:0 0 8px">Reset Password</h1>
    <p style="color:#64748b;margin:0 0 24px">Hai ${name}, kami menerima permintaan reset password untuk akun Anda. Klik tombol di bawah untuk membuat password baru.</p>
    <a href="${url}" style="display:block;background:#059669;color:#fff;text-align:center;padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:24px">
      Reset Password Sekarang
    </a>
    <p style="color:#94a3b8;font-size:13px;margin:0">Link ini valid selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
    <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center">Â© 2025 PUSAKA. Platform B2B Indonesia.</p>
  </div>
</body>
</html>`;
}

// â”€â”€â”€ Send Functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function sendVerificationEmail(email: string, name: string, token: string) {
  if (!process.env.RESEND_API_KEY || !resend) {
    const url = `${APP_URL}/verify-email?token=${token}`;
    console.log(`[EMAIL - DEV] Verification link for ${email}: ${url}`);
    return { success: true, dev: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Verifikasi Email Anda â€” PUSAKA",
      html: verificationEmailHtml(name, token),
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("[EMAIL] Failed to send verification email:", err);
    return { success: false, error: err };
  }
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  if (!process.env.RESEND_API_KEY || !resend) {
    const url = `${APP_URL}/reset-password?token=${token}`;
    console.log(`[EMAIL - DEV] Password reset link for ${email}: ${url}`);
    return { success: true, dev: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Reset Password â€” PUSAKA",
      html: passwordResetEmailHtml(name, token),
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("[EMAIL] Failed to send password reset email:", err);
    return { success: false, error: err };
  }
}
