import Link from "next/link";
import { legalInfo } from "@/lib/legal";

export default function LegalNoticePage() {
  return (
    <main className="min-h-[100dvh] bg-paper-200 px-5 py-12">
      <article className="card-surface mx-auto max-w-3xl p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-450">Informations légales</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink-900">Mentions légales</h1>

        <div className="mt-8 space-y-7 text-sm leading-7 text-ink-800">
          <section><h2 className="font-display text-xl font-medium text-ink-900">Éditeur du service</h2><p className="mt-2">Service : {legalInfo.serviceName}<br />Exploitant : {legalInfo.operatorName}<br />Forme juridique : {legalInfo.legalForm}<br />Numéro d&apos;entreprise : {legalInfo.companyNumber}<br />TVA : {legalInfo.vatNumber}<br />Adresse : {legalInfo.address}<br />E-mail : {legalInfo.email}</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">Hébergement</h2><p className="mt-2">L&apos;application est hébergée via {legalInfo.host}. La base de données peut être opérée par un prestataire distinct configuré par l&apos;exploitant.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">Propriété intellectuelle</h2><p className="mt-2">Les éléments propres au service, son interface, ses textes, son organisation et son code restent protégés par les droits applicables. Les marques et contenus des commerçants restent la propriété de leurs titulaires respectifs.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">Responsabilité</h2><p className="mt-2">Le service fournit un outil de collecte de satisfaction et de redirection volontaire vers les plateformes d&apos;avis. Le commerçant reste responsable de l&apos;usage qu&apos;il fait du service, de ses relations clients et du respect des règles applicables aux plateformes tierces.</p></section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-black/5 pt-6 text-sm">
          <Link href="/confidentialite" className="text-ink-900 underline underline-offset-4">Confidentialité</Link>
          <Link href="/conditions" className="text-ink-900 underline underline-offset-4">Conditions d&apos;utilisation</Link>
          <Link href="/" className="text-slate-450">Retour au site</Link>
        </div>
      </article>
    </main>
  );
}
