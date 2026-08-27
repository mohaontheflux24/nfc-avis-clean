import Link from "next/link";
import { legalInfo } from "@/lib/legal";

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh] bg-paper-200 px-5 py-12">
      <article className="card-surface mx-auto max-w-3xl p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-450">Informations légales</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink-900">Conditions d&apos;utilisation</h1>
        <p className="mt-3 text-sm leading-6 text-slate-450">Dernière mise à jour : 27 août 2026</p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-ink-800">
          <section><h2 className="font-display text-xl font-medium text-ink-900">1. Objet</h2><p className="mt-2">{legalInfo.serviceName} permet aux commerces de mettre à disposition une page de satisfaction via NFC ou lien web, de recevoir des retours privés et de proposer un accès volontaire à leur page d&apos;avis Google.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">2. Accès au service</h2><p className="mt-2">Le service est actuellement fourni gratuitement. L&apos;activation d&apos;un commerce est effectuée manuellement par le responsable du service. Aucun moyen de paiement n&apos;est demandé dans l&apos;application.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">3. Compte commerçant</h2><p className="mt-2">Chaque commerçant reçoit des identifiants personnels. Il doit protéger son mot de passe et signaler toute utilisation non autorisée de son compte.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">4. Utilisation loyale</h2><p className="mt-2">Il est interdit d&apos;utiliser le service pour générer de faux avis, spammer les statistiques, usurper un commerce, collecter des données sans motif légitime ou contourner les règles des plateformes tierces.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">5. Avis Google</h2><p className="mt-2">L&apos;accès à Google est proposé de façon volontaire. Le service ne garantit ni la publication d&apos;un avis, ni son maintien, ni le classement du commerce sur Google. Les règles de Google restent applicables.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">6. Disponibilité et suspension</h2><p className="mt-2">L&apos;accès peut être suspendu en cas d&apos;abus, de fraude, de problème de sécurité, de demande du commerce ou d&apos;utilisation contraire aux présentes conditions. Le service peut aussi connaître des interruptions techniques ou de maintenance.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">7. Données personnelles</h2><p className="mt-2">Le traitement des données personnelles est décrit dans la politique de confidentialité. Les champs prénom et téléphone sont facultatifs ; le commentaire privé est utilisé pour transmettre le retour au commerce concerné.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">8. Évolution du service</h2><p className="mt-2">Le service gratuit peut évoluer, être limité ou arrêté. Toute éventuelle offre payante future devra être présentée séparément avec ses propres conditions avant qu&apos;un paiement ne soit demandé.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">9. Contact</h2><p className="mt-2">Pour toute question concernant le service ou ces conditions : {legalInfo.email}.</p></section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-black/5 pt-6 text-sm">
          <Link href="/confidentialite" className="text-ink-900 underline underline-offset-4">Confidentialité</Link>
          <Link href="/mentions-legales" className="text-ink-900 underline underline-offset-4">Mentions légales</Link>
          <Link href="/" className="text-slate-450">Retour au site</Link>
        </div>
      </article>
    </main>
  );
}
