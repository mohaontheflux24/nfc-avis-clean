"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/setup", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Configuration indisponible.");
        setAvailable(Boolean(data.setupAvailable));
      })
      .catch((e) => setError(e.message))
      .finally(() => setChecking(false));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de configuration.");
      router.push("/login");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de configuration.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-paper px-5 py-10">
      <div className="card-surface w-full max-w-md p-7 sm:p-9">
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-slate-450">
          Configuration initiale
        </p>
        <h1 className="font-display text-3xl font-medium text-ink-900">Créer le compte administrateur</h1>
        <p className="mt-3 font-sans text-sm leading-6 text-slate-450">
          Cette page fonctionne une seule fois. Dès qu’un utilisateur existe, elle se désactive automatiquement.
        </p>

        {checking ? (
          <p className="mt-7 font-sans text-sm text-slate-450">Vérification de la base de données…</p>
        ) : !available ? (
          <div className="mt-7 rounded-xl border border-black/10 bg-white/60 p-4 font-sans text-sm text-slate-600">
            {error || "La configuration initiale est déjà terminée. Va sur /login."}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-5">
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">E-mail administrateur</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-ink-800">Mot de passe</label>
              <input type="password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="10 caractères minimum" />
            </div>
            {error && <p className="font-sans text-sm text-danger">{error}</p>}
            <button disabled={loading} className="btn-primary w-full" type="submit">
              {loading ? "Création…" : "Créer mon compte admin"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
