# Veille informatique + Veille emploi

Deux tableaux de bord dans une seule appli :
- **/** — veille tech : sécurité/attaques, IT généraliste, appareils (flux RSS, gratuit, sans clé API).
- **/emploi** — veille emploi : recherche automatique d'offres en Côte d'Ivoire, tous secteurs,
  scorées par correspondance avec le profil (via l'API Anthropic + recherche web intégrée).

Aucune base de données, aucun conteneur.

## Déployer sur Vercel

1. Créez un dépôt GitHub avec ce dossier (ou glissez-déposez le dossier directement
   sur https://vercel.com/new si vous n'utilisez pas Git).
2. Sur vercel.com → "Add New Project" → importez le dépôt.
3. Vercel détecte automatiquement Next.js, aucune configuration nécessaire pour la partie veille tech.
4. **Pour activer la veille emploi**, ajoutez une variable d'environnement avant de déployer
   (ou dans Project Settings → Environment Variables si déjà déployé) :
   - Nom : `GEMINI_API_KEY`
   - Valeur : votre clé API Gemini, créée gratuitement sur https://aistudio.google.com/apikey
     (connexion avec un compte Google, aucune carte bancaire requise)
5. Cliquez sur "Deploy". C'est en ligne en ~1 minute.

Sans la clé API, la page `/emploi` s'affichera simplement vide (pas d'erreur bloquante).

## Coût de la veille emploi

Le tier gratuit de Google AI Studio inclut 500 requêtes de recherche web gratuites par jour
sur les modèles Flash (celui utilisé ici). La page est mise en cache 12h
(`revalidate = 43200`), donc au pire 2 appels par jour — largement dans la limite gratuite.

À savoir : sur le tier gratuit, Google peut utiliser le contenu de vos requêtes (donc les
infos de votre profil) pour améliorer ses modèles. Si ça vous gêne, il est possible de repasser
sur l'API Anthropic (payante mais sans ce partage de données) — dites-le si vous voulez ce
changement.

## Tester en local avant de déployer (optionnel)

```bash
npm install
npm run dev
```

Puis ouvrez http://localhost:3000

## Personnaliser les sources

**Veille tech** : modifiez `lib/feeds.ts` (liste `{ name, url }` par catégorie).
Si un flux RSS change d'URL ou tombe, il est simplement ignoré (pas de crash) —
regardez les logs Vercel ("Runtime Logs") pour repérer les flux cassés.

**Veille emploi** : modifiez `lib/candidate-profile.ts` pour ajuster le profil
(expérience, compétences, ambitions, types de postes recherchés) — c'est ce texte
qui sert de base au scoring IA. Le seuil de score minimum affiché par défaut (80%)
se règle avec le curseur sur la page ; le seuil de collecte (75%) se change dans
`lib/job-search.ts`.

## Aller plus loin (non inclus ici, pour rester simple)

- **Alertes push en temps réel** (ex. nouvelle CVE critique, ou nouvelle offre à 95%+) :
  nécessiterait un Vercel Cron Job + un petit stockage (Vercel KV / Upstash Redis, gratuit)
  pour mémoriser ce qui a déjà été vu, puis un webhook vers ntfy.sh, Discord ou Telegram.
- **Résumé quotidien par IA de la veille tech** : même principe que la veille emploi,
  appliqué au dossier "Sécurité & attaques".

Dites-moi si vous voulez qu'on ajoute l'une de ces briques.
