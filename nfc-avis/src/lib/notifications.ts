import nodemailer from "nodemailer";

function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
}

function whatsappConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
}

export async function sendPrivateReviewNotifications(input: {
  merchantName: string;
  email?: string | null;
  whatsapp?: string | null;
  rating: number;
  firstName?: string | null;
  comment?: string | null;
  phone?: string | null;
}) {
  const result = { email: false, whatsapp: false };
  const customer = input.firstName?.trim() || "Un client";
  const message = `${customer} a laissé un retour privé ${input.rating}/5 pour ${input.merchantName}.\n\n${input.comment || "Aucun commentaire."}${input.phone ? `\n\nTéléphone : ${input.phone}` : ""}`;

  if (input.email && emailConfigured()) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: input.email,
        subject: `Nouveau retour privé ${input.rating}/5 — ${input.merchantName}`,
        text: message,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>Nouveau retour privé ${input.rating}/5</h2><p><strong>${escapeHtml(customer)}</strong> a laissé un retour pour <strong>${escapeHtml(input.merchantName)}</strong>.</p><p>${escapeHtml(input.comment || "Aucun commentaire.")}</p>${input.phone ? `<p>Téléphone : ${escapeHtml(input.phone)}</p>` : ""}<p>Connectez-vous à votre dashboard pour consulter vos retours.</p></div>`,
      });
      result.email = true;
    } catch (error) {
      console.error("Notification email impossible", error);
    }
  }

  if (input.whatsapp && whatsappConfigured()) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID!;
      const token = process.env.TWILIO_AUTH_TOKEN!;
      const from = normalizeWhatsapp(process.env.TWILIO_WHATSAPP_FROM!);
      const to = normalizeWhatsapp(input.whatsapp);
      const body = new URLSearchParams({ From: from, To: to, Body: message });
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      result.whatsapp = response.ok;
      if (!response.ok) console.error("Notification WhatsApp impossible", await response.text());
    } catch (error) {
      console.error("Notification WhatsApp impossible", error);
    }
  }

  return result;
}

function normalizeWhatsapp(value: string) {
  const trimmed = value.trim();
  return trimmed.startsWith("whatsapp:") ? trimmed : `whatsapp:${trimmed}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char] || char));
}
