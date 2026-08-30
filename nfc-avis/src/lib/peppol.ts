type PeppolInvoice = {
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  currency: string;
  seller: { name: string; vatNumber?: string; companyNumber?: string; address?: string };
  buyer: { name: string; vatNumber?: string; peppolId?: string; email?: string };
  lines: Array<{ description: string; quantity: number; unitPriceCents: number; vatRate: number }>;
};

export async function sendPeppolInvoice(invoice: PeppolInvoice) {
  const url = process.env.PEPPOL_API_URL;
  const token = process.env.PEPPOL_API_TOKEN;
  if (!url || !token) return { sent: false, status: "not_configured" as const };

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ senderId: process.env.PEPPOL_SENDER_ID, ...invoice }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Peppol API ${response.status}: ${JSON.stringify(body)}`);
  return { sent: true, status: "sent" as const, messageId: body.messageId ?? body.id ?? null };
}
