import "server-only";

import nodemailer from "nodemailer";

import { getAppUrl } from "@/lib/auth/config";
import { getStoreSettings } from "@/lib/services/settings.service";
import { formatPrice } from "@/lib/utils";

export type OrderMailItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

/** Plain order snapshot the notification mail needs — no Prisma coupling. */
export type OrderMailData = {
  orderNumber: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode: string | null;
  occasion: string | null;
  total: number;
  items: OrderMailItem[];
};

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string | null | undefined): string {
  return (value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status.toLowerCase();
}

function paymentMethodLabel(method: string): string {
  return method === "COD" ? "Cash on Delivery" : "Online payment (Razorpay)";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM_EMAIL,
  );
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

function buildOrderEmailHtml(
  order: OrderMailData,
  storeName: string,
): string {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #E3DACB;font-size:14px;color:#1C1A17;">
            ${escapeHtml(item.productName)}
            <div style="font-size:12px;color:#857D72;margin-top:2px;">
              ${item.quantity} × ${formatPrice(item.unitPrice)}
            </div>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #E3DACB;font-size:14px;color:#1C1A17;text-align:right;white-space:nowrap;">
            ${formatPrice(item.lineTotal)}
          </td>
        </tr>`,
    )
    .join("");

  const couponLine = order.couponCode
    ? `
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#857D72;">Discount (${escapeHtml(order.couponCode)})</td>
        <td style="padding:4px 0;font-size:14px;color:#0f8a4d;text-align:right;">−${formatPrice(order.discountAmount)}</td>
      </tr>`
    : "";

  const occasionLine = order.occasion
    ? `<div style="margin-top:8px;font-size:13px;color:#857D72;">Occasion: <strong style="color:#1C1A17;">${escapeHtml(order.occasion)}</strong></div>`
    : "";

  const adminUrl = `${getAppUrl()}/admin/orders`;

  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#F4EFE6;">
  <div style="margin:0 auto;max-width:640px;font-family:Arial,Helvetica,sans-serif;">
    <div style="background:#131110;padding:28px 32px;">
      <div style="font-size:20px;font-weight:bold;color:#ffffff;">${escapeHtml(storeName)}</div>
      <div style="font-size:13px;color:#DCD2C0;margin-top:4px;">New order received — ${escapeHtml(order.orderNumber)}</div>
    </div>

    <div style="background:#ffffff;padding:32px;">
      <p style="margin:0 0 6px;font-size:17px;font-weight:bold;color:#1C1A17;">
        Order ${escapeHtml(order.orderNumber)}
      </p>
      <p style="margin:0 0 24px;font-size:13px;color:#857D72;">
        Placed on ${formatDate(order.createdAt)} · ${paymentMethodLabel(order.paymentMethod)} · Payment ${statusLabel(order.paymentStatus)} · Status ${statusLabel(order.status)}
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="width:50%;vertical-align:top;padding:0 16px 20px 0;">
            <div style="font-size:12px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#857D72;margin-bottom:8px;">Customer</div>
            <div style="font-size:14px;color:#1C1A17;line-height:1.6;">${escapeHtml(order.customerName)}</div>
            <div style="font-size:13px;color:#857D72;line-height:1.6;">
              <a href="mailto:${escapeHtml(order.customerEmail)}" style="color:#BC4E22;">${escapeHtml(order.customerEmail)}</a><br />
              ${escapeHtml(order.customerPhone)}
            </div>
          </td>
          <td style="width:50%;vertical-align:top;padding:0 0 20px 16px;">
            <div style="font-size:12px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#857D72;margin-bottom:8px;">Ship to</div>
            <div style="font-size:13px;color:#1C1A17;line-height:1.6;">
              ${escapeHtml(order.customerName)}<br />
              ${escapeHtml(order.street)}<br />
              ${escapeHtml(order.city)}, ${escapeHtml(order.state)} — ${escapeHtml(order.pincode)}<br />
              ${escapeHtml(order.country)}
            </div>
            ${occasionLine}
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #E3DACB;border-radius:12px;">
        <tr>
          <th align="left" style="padding:10px 12px;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#857D72;border-bottom:1px solid #E3DACB;">Item</th>
          <th align="right" style="padding:10px 12px;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#857D72;border-bottom:1px solid #E3DACB;">Amount</th>
        </tr>
        ${rows}
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:16px;">
        <tr>
          <td style="padding:4px 0;font-size:14px;color:#857D72;">Subtotal</td>
          <td style="padding:4px 0;font-size:14px;color:#1C1A17;text-align:right;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:14px;color:#857D72;">Shipping</td>
          <td style="padding:4px 0;font-size:14px;color:#1C1A17;text-align:right;">${order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</td>
        </tr>
        ${couponLine}
        <tr>
          <td style="padding:12px 0 4px;font-size:16px;font-weight:bold;color:#1C1A17;">Total</td>
          <td style="padding:12px 0 4px;font-size:18px;font-weight:bold;color:#BC4E22;text-align:right;">${formatPrice(order.total)}</td>
        </tr>
      </table>

      <div style="margin-top:28px;text-align:center;">
        <a href="${adminUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#1C1A17;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">View order in admin</a>
      </div>
    </div>

    <div style="padding:20px 32px;text-align:center;font-size:12px;color:#857D72;">
      ${escapeHtml(storeName)} · This is an automatic order notification sent to the store support email.
    </div>
  </div>
</body>
</html>`;
}

function buildOrderEmailText(order: OrderMailData, storeName: string): string {
  const lines = [
    `${storeName} — New order received`,
    `Order ${order.orderNumber}`,
    `Placed on ${formatDate(order.createdAt)}`,
    `Payment: ${paymentMethodLabel(order.paymentMethod)} (${statusLabel(order.paymentStatus)})`,
    "",
    "Customer:",
    `  ${order.customerName}`,
    `  ${order.customerEmail}`,
    `  ${order.customerPhone}`,
    "",
    "Ship to:",
    `  ${order.street}`,
    `  ${order.city}, ${order.state} — ${order.pincode}`,
    `  ${order.country}`,
  ];

  if (order.occasion) lines.push(`  Occasion: ${order.occasion}`);

  lines.push("", "Items:");
  for (const item of order.items) {
    lines.push(`  ${item.productName} — ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(item.lineTotal)}`);
  }

  lines.push(
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Shipping: ${order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}`,
  );
  if (order.couponCode) {
    lines.push(`Discount (${order.couponCode}): −${formatPrice(order.discountAmount)}`);
  }
  lines.push(`Total: ${formatPrice(order.total)}`);
  lines.push("", `Open in admin: ${getAppUrl()}/admin/orders`);

  return lines.join("\n");
}

/**
 * Emails the store's support email (Admin → Settings) with full order details
 * whenever a customer places an order. Never throws — a mail failure must not
 * break checkout, so problems are logged and ignored.
 */
export async function sendNewOrderNotificationMail(
  order: OrderMailData,
): Promise<void> {
  try {
    if (!isMailConfigured()) {
      console.warn(
        `[mail] SMTP not configured; skipping admin notification for ${order.orderNumber}.`,
      );
      return;
    }

    const settings = await getStoreSettings();
    const recipient = (settings.supportEmail ?? "").trim();
    if (!recipient) {
      console.warn(
        `[mail] No support email set; skipping admin notification for ${order.orderNumber}.`,
      );
      return;
    }

    await getTransporter().sendMail({
      from: {
        name: process.env.SMTP_FROM_NAME || settings.storeName,
        address: process.env.SMTP_FROM_EMAIL as string,
      },
      to: recipient,
      subject: `New order ${order.orderNumber} — ${formatPrice(order.total)} (${settings.storeName})`,
      html: buildOrderEmailHtml(order, settings.storeName),
      text: buildOrderEmailText(order, settings.storeName),
    });

    console.log(
      `[mail] Admin order notification sent for ${order.orderNumber} → ${recipient}`,
    );
  } catch (error) {
    console.error("[mail] Failed to send admin order notification:", error);
  }
}
