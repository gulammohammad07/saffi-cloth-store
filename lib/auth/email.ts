import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { getAppUrl } from "@/lib/auth/config";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

function buildTransporter(): Transporter | null {
  if (!isSmtpConfigured()) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendMail(options: MailOptions) {
  const transporter = buildTransporter();
  if (!transporter) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[auth:email] SMTP not configured. Would have sent email to ${options.to} — ` +
          `"${options.subject}". Preview below (dev only):`,
      );
      console.log(options.html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
    }
    return false;
  }

  const fromName = process.env.SMTP_FROM_NAME ?? "Libaas";
  const fromAddress = process.env.SMTP_FROM_EMAIL ?? "noreply@libaas.com";

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  return true;
}

export async function sendPasswordResetEmail(input: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const { to, name, resetUrl } = input;
  const appUrl = getAppUrl();
  const expiresInHours = 1;

  const html = `
    <div style="background:#F4EFE6;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #E9E1D3;border-radius:16px;overflow:hidden;">
        <div style="background:#1C1A17;padding:28px 32px;text-align:center;">
          <p style="margin:0;color:#BC4E22;font-size:18px;letter-spacing:4px;font-weight:600;">LIBAAS</p>
        </div>
        <div style="padding:32px;">
          <h1 style="margin:0 0 12px;color:#1C1A17;font-size:22px;">Reset your password</h1>
          <p style="margin:0 0 20px;color:#857D72;font-size:15px;line-height:1.6;">
            Hello ${name}, we received a request to reset the password for your account.
            This link is valid for the next ${expiresInHours} hour${expiresInHours > 1 ? "s" : ""}.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#1C1A17;color:#ffffff;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">
            Reset Password
          </a>
          <p style="margin:24px 0 0;color:#9C958A;font-size:13px;line-height:1.6;">
            If you didn't request this, you can safely ignore this email. Your password won't change.
          </p>
          <p style="margin:8px 0 0;color:#9C958A;font-size:13px;line-height:1.6;">
            Or copy and paste this link into your browser:<br/>
            <span style="word-break:break-all;color:#BC4E22;">${resetUrl}</span>
          </p>
        </div>
        <div style="background:#F4EFE6;padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#9C958A;font-size:12px;">© ${new Date().getFullYear()} Libaas · ${appUrl}</p>
        </div>
      </div>
    </div>
  `;

  const text = `Hello ${name}, we received a request to reset the password for your account. Visit this link to reset it (valid for ${expiresInHours} hour${expiresInHours > 1 ? "s" : ""}): ${resetUrl}`;

  return sendMail({ to, subject: "Reset your Libaas password", html, text });
}
