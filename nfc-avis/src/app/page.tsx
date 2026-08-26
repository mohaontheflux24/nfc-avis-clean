import Link from "next/link";
import { ArrowRight, Star, Smartphone, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-10 text-ink-900 sm:px-10">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-ink-800/10 bg-white px-4 py-2 text-sm text-slate-450 shadow-sm">
          <Smartphone size={16} />
          Avis clients NFC
        </div>

        <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] sm:text-7xl">
          Transformez un simple tap NFC en avis Google.
        </h1>

        <p className="mt-6 max-w-2xl font-sans text-lg leading-8 text-slate-450">
          Les clients satisfaits sont guidés vers Google. Les retours négatifs restent privés pour permettre au commerçant de réagir rapidement.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="btn-primary inline-flex items-center gap-2">
            Se connecter <ArrowRight size={17} />
          </Link>
          <Link href="/r/le-petit-cafe" className="btn-ghost inline-flex items-center gap-2">
            Voir la démo NFC
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <div className="card-surface p-5">
            <Star className="mb-3" size={22} />
            <p className="font-sans font-semibold">Plus d'avis Google</p>
            <p className="mt-1 text-sm text-slate-450">Parcours ultra simple après le scan de la carte.</p>
          </div>
          <div className="card-surface p-5">
            <ShieldCheck className="mb-3" size={22} />
            <p className="font-sans font-semibold">Retours privés</p>
            <p className="mt-1 text-sm text-slate-450">Les notes faibles sont envoyées directement au commerce.</p>
          </div>
          <div className="card-surface p-5">
            <Smartphone className="mb-3" size={22} />
            <p className="font-sans font-semibold">Dashboard commerçant</p>
            <p className="mt-1 text-sm text-slate-450">Scans, avis, conversion Google et historique.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
