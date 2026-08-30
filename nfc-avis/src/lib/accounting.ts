import { prisma } from "@/lib/prisma";

export async function getAccountingSummary(from: Date, to: Date) {
  const [invoices, payments, expenses] = await Promise.all([
    prisma.invoice.findMany({ where: { issuedAt: { gte: from, lt: to } } }),
    prisma.payment.findMany({ where: { createdAt: { gte: from, lt: to }, status: "SUCCEEDED" } }),
    prisma.expense.findMany({ where: { expenseDate: { gte: from, lt: to } } }),
  ]);

  const salesExVat = invoices.reduce((sum, x) => sum + x.subtotalCents, 0);
  const vatCollected = invoices.reduce((sum, x) => sum + x.vatCents, 0);
  const cashReceived = payments.reduce((sum, x) => sum + x.amountCents, 0);
  const stripeFees = payments.reduce((sum, x) => sum + x.feeCents, 0);
  const expensesExVat = expenses.reduce((sum, x) => sum + Math.max(0, x.amountCents - x.vatCents), 0);
  const vatDeductible = expenses.reduce((sum, x) => sum + x.vatCents, 0);
  const vatDueEstimate = Math.max(0, vatCollected - vatDeductible);

  return { salesExVat, vatCollected, cashReceived, stripeFees, expensesExVat, vatDeductible, vatDueEstimate };
}

export const euros = (cents: number) => new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR" }).format(cents / 100);
