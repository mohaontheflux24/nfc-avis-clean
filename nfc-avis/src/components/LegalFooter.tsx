import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="border-t border-black/5 bg-paper-200 px-5 py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-450">
        <Link href="/confidentialite" className="hover:text-ink-900">Confidentialité</Link>
        <Link href="/conditions" className="hover:text-ink-900">Conditions d&apos;utilisation</Link>
        <Link href="/mentions-legales" className="hover:text-ink-900">Mentions légales</Link>
      </div>
    </footer>
  );
}
