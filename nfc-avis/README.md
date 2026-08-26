# Avis Clients NFC

Application Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma pour un
système d'avis clients déclenché par carte NFC : notation en un tap, redirection
vers Google Avis pour les notes 4-5★, formulaire privé + notification
e-mail/WhatsApp automatique pour les notes 1-3★, dashboard commerçant et
espace administrateur multi-commerces.

## Stack

- **Next.js 14** (App Router, Server Components + Route Handlers)
- **TypeScript**
- **Tailwind CSS** + **Framer Motion** (animations)
- **Prisma** + **PostgreSQL** (Neon, Vercel Postgres, Supabase…)
- **NextAuth.js** (authentification par identifiants, sessions JWT)
- **Recharts** pour les graphiques du dashboard
- **Nodemailer** (e-mail) + **Twilio WhatsApp API** (optionnel) pour les
  notifications de retours négatifs

## Structure

```
src/
  app/
    page.tsx                 → page marketing d'accueil
    login/                   → connexion commerçant / admin
    r/[cardId]/               → page publique scannée par la carte NFC
    dashboard/                → espace commerçant (protégé)
    admin/                     → espace administrateur (protégé)
    api/                        → routes API (scan, review, google-click,
                                    dashboard/*, admin/*, auth)
  components/                  → composants UI réutilisables
  lib/                          → prisma, auth, notifications, stats, utils
  middleware.ts                → protection des routes /dashboard et /admin
prisma/
  schema.prisma                → modèle de données
  seed.ts                        → jeu de données de démonstration
```

## Démarrage local

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement**

   ```bash
   cp .env.example .env
   ```

   Renseignez au minimum `DATABASE_URL` (une base PostgreSQL — [Neon](https://neon.tech)
   propose un plan gratuit très simple à connecter) et `NEXTAUTH_SECRET`
   (générez-le avec `openssl rand -base64 32`).

3. **Créer les tables et les données de démonstration**

   ```bash
   npm run db:push
   npm run db:seed
   ```

   Cela crée :
   - un compte administrateur : `admin@monsite.com` / `admin1234`
   - un commerce de démonstration « Le Petit Café » avec le compte
     `commercant@lepetitcafe.fr` / `merchant1234`
   - une carte NFC de test accessible sur `/r/le-petit-cafe`

   ⚠️ Changez ces mots de passe avant toute mise en production.

4. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

   - Page publique de test : `http://localhost:3000/r/le-petit-cafe`
   - Connexion : `http://localhost:3000/login`

## Déploiement sur Vercel

1. Poussez ce projet sur un dépôt GitHub/GitLab.
2. Importez-le dans Vercel.
3. Ajoutez une base de données Postgres (Vercel Postgres, Neon ou Supabase)
   et renseignez `DATABASE_URL` dans les variables d'environnement du projet
   Vercel, ainsi que `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (l'URL de production),
   les identifiants SMTP et, si besoin, les identifiants Twilio WhatsApp.
4. Vercel exécute automatiquement `prisma generate` (via le script
   `postinstall`) puis `next build` (script `build`).
5. Après le premier déploiement, exécutez `npx prisma db push` (en local,
   pointé sur la base de production) ou intégrez cette étape à votre pipeline
   pour créer les tables. Exécutez ensuite `npm run db:seed` si vous voulez un
   compte administrateur de démonstration — sinon créez directement un
   utilisateur `ADMIN` via un script ou Prisma Studio.

## Fonctionnement du parcours client

1. La carte NFC pointe vers `https://votresite.com/r/<identifiant-carte>`.
2. L'ouverture de la page enregistre un scan (`POST /api/scan`) et affiche
   « Comment s'est passée votre expérience ? » avec 5 étoiles.
3. **Note 4 ou 5** → l'avis est enregistré, un message de remerciement animé
   s'affiche avec un gros bouton « Laisser mon avis sur Google » et une
   redirection automatique après quelques secondes (`googleReviewUrl` du
   commerce). Le clic est comptabilisé (`POST /api/google-click`).
4. **Note 1, 2 ou 3** → un formulaire privé s'affiche (prénom facultatif,
   commentaire, téléphone facultatif). À l'envoi, l'avis est enregistré comme
   « privé » et le commerçant est notifié automatiquement par e-mail (et par
   WhatsApp si Twilio est configuré).

## Espace commerçant (`/dashboard`)

- Statistiques : scans, notes reçues, clics Google, taux de conversion, note
  moyenne, répartition des notes, courbe scans/avis — filtrables sur 7 jours,
  30 jours ou depuis le début.
- Historique complet des avis (publics et retours privés).
- Paramètres : nom, logo, lien Google Avis, numéro WhatsApp, e-mail de
  contact, couleurs de la page publique.

## Espace administrateur (`/admin`)

- Liste de tous les commerces avec indicateurs clés.
- Création de commerces (génère automatiquement un compte de connexion et une
  première carte NFC).
- Édition/suppression de commerces.
- Attribution de plusieurs cartes NFC à un même commerce, chacune avec sa
  propre URL `/r/<identifiant-carte>` et son propre libellé (ex. « Comptoir
  caisse », « Table 4 »…).
- Vue détaillée des statistiques et de l'historique des avis par commerce.

## Notifications des retours négatifs

- **E-mail** : configuré via les variables `SMTP_*`. Sans configuration SMTP,
  l'envoi est simplement ignoré (log en console) pour ne pas bloquer le
  parcours client.
- **WhatsApp** : optionnel, via l'API WhatsApp Business de Twilio
  (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`). Sans
  configuration, seul l'e-mail est envoyé.

## Sécurité

- Authentification par identifiants (NextAuth, sessions JWT, mots de passe
  hachés avec bcrypt).
- Rôles `ADMIN` / `MERCHANT` avec middleware qui protège `/dashboard/*` et
  `/admin/*`.
- Chaque commerçant ne peut voir/modifier que ses propres données (toutes les
  routes API du dashboard filtrent par `session.user.merchantId`).
