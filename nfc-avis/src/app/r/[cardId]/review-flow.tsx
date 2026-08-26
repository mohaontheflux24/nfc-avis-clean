"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarRating from "@/components/StarRating";
import { cn } from "@/lib/utils";

type Step = "rating" | "sending" | "thanks-positive" | "feedback-form" | "thanks-negative";

export default function ReviewFlow({
  cardId,
  merchantId,
  merchantName,
  logoUrl,
  googleReviewUrl,
  primaryColor,
  accentColor,
}: {
  cardId: string;
  merchantId: string;
  merchantName: string;
  logoUrl: string | null;
  googleReviewUrl: string | null;
  primaryColor: string;
  accentColor: string;
}) {
  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const scanRecorded = useRef(false);

  useEffect(() => {
    if (scanRecorded.current) return;
    scanRecorded.current = true;
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId }),
    }).catch(() => {});
  }, [cardId]);

  async function handleSelectRating(value: number) {
    setRating(value);
    setStep("sending");

    if (value >= 4) {
      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId, rating: value }),
        });
        const data = await res.json();
        setReviewId(data.reviewId ?? null);
      } catch {
        // fail silently, still show thanks
      }
      setStep("thanks-positive");
    } else {
      setTimeout(() => setStep("feedback-form"), 350);
    }
  }

  function goToGoogle() {
    if (!googleReviewUrl) return;
    fetch("/api/google-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantId, reviewId }),
    }).catch(() => {});
    window.location.href = googleReviewUrl;
  }

  useEffect(() => {
    if (step !== "thanks-positive" || !googleReviewUrl) return;
    if (countdown <= 0) {
      goToGoogle();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, countdown, googleReviewUrl]);

  return (
    <main
      className="flex min-h-[100dvh] flex-col items-center justify-center px-5 py-10"
      style={{
        background: `radial-gradient(120% 100% at 50% 0%, ${accentColor}14 0%, #faf8f4 55%)`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={merchantName}
              className="h-16 w-16 rounded-2xl object-cover shadow-soft"
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-semibold text-white shadow-soft"
              style={{ backgroundColor: primaryColor }}
            >
              {merchantName.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="font-sans text-sm font-medium uppercase tracking-[0.18em] text-slate-450">
            {merchantName}
          </p>
        </div>

        <div className="card-surface overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
          <AnimatePresence mode="wait">
            {step === "rating" && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8 text-center"
              >
                <h1 className="font-display text-[26px] font-medium leading-tight text-ink-900 sm:text-3xl">
                  Comment s&apos;est passée
                  <br /> votre expérience&nbsp;?
                </h1>
                <StarRating value={rating} onChange={handleSelectRating} accentColor={accentColor} />
              </motion.div>
            )}

            {step === "sending" && (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-10 text-center"
              >
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-ink-800/10"
                  style={{ borderTopColor: accentColor }}
                />
                <p className="font-sans text-sm text-slate-450">Un instant…</p>
              </motion.div>
            )}

            {step === "thanks-positive" && (
              <motion.div
                key="thanks-positive"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="relative flex flex-col items-center gap-6 text-center"
              >
                <Confetti accentColor={accentColor} />
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${accentColor}22` }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                  </svg>
                </motion.div>
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-medium text-ink-900">Merci infiniment !</h2>
                  <p className="font-sans text-[15px] text-slate-450">
                    Votre avis compte énormément pour {merchantName}.
                    {googleReviewUrl && " Un dernier geste nous aiderait beaucoup :"}
                  </p>
                </div>
                {googleReviewUrl && (
                  <div className="flex w-full flex-col items-center gap-3">
                    <button onClick={goToGoogle} className="btn-brass w-full">
                      Laisser mon avis sur Google
                    </button>
                    <p className="font-sans text-xs text-slate-450">
                      Redirection automatique dans {countdown}s
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {step === "feedback-form" && (
              <FeedbackForm
                key="feedback-form"
                cardId={cardId}
                rating={rating}
                accentColor={accentColor}
                onSubmitted={() => setStep("thanks-negative")}
              />
            )}

            {step === "thanks-negative" && (
              <motion.div
                key="thanks-negative"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center gap-5 py-4 text-center"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${accentColor}22` }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7.5-4.6-9.6-9.1C.9 8.3 2.6 5 6 5c2 0 3.4 1.1 4 2 .6-.9 2-2 4-2 3.4 0 5.1 3.3 3.6 6.9C19.5 16.4 12 21 12 21z" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-medium text-ink-900">
                  Merci pour votre retour,
                  <br /> il nous aidera à nous améliorer.
                </h2>
                <p className="font-sans text-[15px] text-slate-450">
                  Votre message a été transmis directement à {merchantName}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center font-sans text-xs text-slate-450/80">
          Avis sécurisé · propulsé par votre système d&apos;avis NFC
        </p>
      </div>
    </main>
  );
}

function FeedbackForm({
  cardId,
  rating,
  accentColor,
  onSubmitted,
}: {
  cardId: string;
  rating: number;
  accentColor: string;
  onSubmitted: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [comment, setComment] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Merci de nous expliquer brièvement ce qui s'est mal passé.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, rating, firstName, comment, phone }),
      });
      if (!res.ok) throw new Error();
      onSubmitted();
    } catch {
      setError("Une erreur est survenue. Merci de réessayer.");
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 text-left"
    >
      <div className="text-center">
        <h2 className="font-display text-2xl font-medium text-ink-900">Aidez-nous à progresser</h2>
        <p className="mt-1 font-sans text-sm text-slate-450">
          Ce message reste privé, il n&apos;est jamais publié en ligne.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
          Prénom <span className="text-slate-450">(facultatif)</span>
        </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="input-field"
          placeholder="Votre prénom"
          maxLength={80}
        />
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
          Qu&apos;est-ce qui s&apos;est mal passé ?
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input-field min-h-[120px] resize-none"
          placeholder="Décrivez-nous votre expérience…"
          maxLength={2000}
        />
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">
          Numéro de téléphone <span className="text-slate-450">(facultatif)</span>
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          className="input-field"
          placeholder="Pour que l'on puisse vous rappeler"
          maxLength={40}
        />
      </div>

      {error && <p className="font-sans text-sm text-danger">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary mt-1 w-full">
        {submitting ? "Envoi…" : "Envoyer mon retour"}
      </button>
    </motion.form>
  );
}

function Confetti({ accentColor }: { accentColor: string }) {
  const pieces = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute top-0 block h-2 w-2 animate-confetti rounded-sm"
          style={{
            left: `${(i / pieces.length) * 100}%`,
            backgroundColor: i % 2 === 0 ? accentColor : "#14141c",
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}
