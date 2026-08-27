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
          <section><h2 className="font-display text-xl font-medium text-ink-900">1. Données collectées</h2><p className="mt-2">Lorsqu&apos;un utilisateur laisse un retour, le service peut enregistrer la note, le prénom facultatif, le commentaire, le numéro de téléphone facultatif, la carte NFC utilisée et la date du retour. Le prénom et le téléphone ne sont pas obligatoires.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">2. Finalités</h2><p className="mt-2">Les données sont utilisées uniquement pour transmettre le retour au commerce concerné, afficher des statistiques de satisfaction, assurer le fonctionnement et la sécurité du service et, lorsqu&apos;un numéro est fourni volontairement, permettre au commerçant de reprendre contact avec l&apos;utilisateur.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">3. Base et information</h2><p className="mt-2">L&apos;utilisateur est informé au moment de l&apos;envoi du formulaire de la finalité du traitement et peut consulter cette politique avant de transmettre son retour. Les données facultatives peuvent être laissées vides.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">4. Destinataires</h2><p className="mt-2">Les retours privés sont accessibles uniquement au commerce auquel la carte NFC est rattachée et au responsable du service lorsque cela est nécessaire pour l&apos;administration, la sécurité ou le support. Ils ne sont pas publiés comme avis publics et ne sont pas vendus à des tiers.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">5. Conservation</h2><p className="mt-2">Les retours contenant des données personnelles sont destinés à être supprimés au plus tard après 12 mois, sauf nécessité particulière ou obligation légale justifiant une conservation plus longue. Une demande de suppression peut également être adressée avant ce délai.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">6. Sécurité</h2><p className="mt-2">L&apos;accès aux espaces commerçants est protégé par authentification. Les mots de passe ne sont pas conservés en clair. Des contrôles d&apos;accès et des limitations de requêtes sont utilisés pour réduire les accès non autorisés et les abus.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">7. Vos droits</h2><p className="mt-2">Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données, ainsi que poser toute question relative à leur traitement. Contact : <strong>{legalInfo.email}</strong>.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">8. Prestataires techniques</h2><p className="mt-2">Le service s&apos;appuie sur des prestataires techniques pour l&apos;hébergement de l&apos;application et de la base de données. L&apos;hébergement applicatif est notamment assuré via {legalInfo.host}. Ces prestataires n&apos;utilisent pas les retours clients pour les propres finalités commerciales du service.</p></section>
          <section><h2 className="font-display text-xl font-medium text-ink-900">9. Responsable du traitement</h2><p className="mt-2">Responsable : {legalInfo.operatorName}.{legalInfo.address ? <> Adresse : {legalInfo.address}.</> : null} Contact : {legalInfo.email}.</p></section>
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
