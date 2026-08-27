import Link from "next/link";
import { legalInfo } from "@/lib/legal";

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-paper-200 px-5 py-12">
      <article className="card-surface mx-auto max-w-3xl p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-450">Informations légales</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink-900">Politique de confidentialité</h1>
        <p className="mt-3 text-sm leading-6 text-slate-450">Dernière mise à jour : 27 août 2026</p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-ink-800">
          <section><h2 className="font-display text-xl font-medium text-ink-900">1. Données collectées</h2><p className="mt-2">Lorsqu&apos;un client laisse un retour privé, le service peut enregistrer sa note, son prénom facultatif, son commentaire, son numéro de téléphone facultatif, la carte NFC utilisée et la date du retour.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">2. Pourquoi ces données sont utilisées</h2><p className="mt-2">Ces données servent à transmettre le retour au commerce concerné, afficher les statistiques de satisfaction et permettre au commerçant de répondre ou de rappeler le client lorsqu&apos;un numéro a été fourni volontairement.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">3. Accès aux données</h2><p className="mt-2">Les retours privés sont accessibles au commerce auquel la carte NFC est rattachée et à l&apos;administrateur du service pour la gestion technique et le support. Ils ne sont pas publiés comme avis publics.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">4. Conservation et sécurité</h2><p className="mt-2">Les données sont conservées uniquement pendant la durée nécessaire au fonctionnement du service et aux obligations applicables. Des mesures techniques sont utilisées pour limiter les accès non autorisés, notamment l&apos;authentification des comptes et le stockage chiffré des mots de passe.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">5. Vos droits</h2><p className="mt-2">Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données lorsque la réglementation applicable le permet. Pour exercer vos droits, contactez : <strong>{legalInfo.email}</strong>.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">6. Sous-traitants techniques</h2><p className="mt-2">Le service utilise des prestataires techniques pour l&apos;hébergement et la base de données. L&apos;hébergement applicatif est notamment assuré via {legalInfo.host}.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">7. Responsable du service</h2><p className="mt-2">Exploitant : {legalInfo.operatorName}. Adresse : {legalInfo.address}. Contact : {legalInfo.email}.</p></section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-black/5 pt-6 text-sm">
          <Link href="/mentions-legales" className="text-ink-900 underline underline-offset-4">Mentions légales</Link>
          <Link href="/conditions" className="text-ink-900 underline underline-offset-4">Conditions d&apos;utilisation</Link>
          <Link href="/" className="text-slate-450">Retour au site</Link>
        </div>
      </article>
    </main>
  );
}
