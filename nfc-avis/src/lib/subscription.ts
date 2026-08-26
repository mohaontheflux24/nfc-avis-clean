import type { Subscription, Merchant } from "@prisma/client";

export const DEFAULT_TRIAL_DAYS = 14;

export function isSubscriptionUsable(
  merchant: Pick<Merchant, "active"> & { subscription?: Subscription | null }
) {
  if (!merchant.active) return false;
  const sub = merchant.subscription;
  if (!sub) return false;
  if (sub.status === "ACTIVE") return !sub.endsAt || sub.endsAt > new Date();
  if (sub.status === "TRIAL") return !!sub.trialEndsAt && sub.trialEndsAt > new Date();
  return false;
}

export function defaultTrialEnd() {
  const date = new Date();
  date.setDate(date.getDate() + DEFAULT_TRIAL_DAYS);
  return date;
}
