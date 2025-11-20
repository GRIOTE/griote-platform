# Griote Foundation (Frontend)

Griote Foundation est une plateforme panafricaine valorisant les travaux de recherche (académiques ou personnels, tous niveaux) et facilitant l’accès aux bourses pour les niveaux Master et Doctorat. Ce dépôt contient le frontend du site web, construit avec **React**, **TypeScript**, **Vite**, et **Tailwind CSS**, avec une esthétique panafricaine (bleu profond #142393, jaune doré #FFDE59, motifs bogolan/kente).

## Fonctionnalités

- **Accueil** : Barre de recherche centrale (inspirée de Pixabay), projets récents, mission de la fondation.
- **Recherche de projets** : Exploration des projets publics avec filtres (mots-clés, thématiques, niveau, date).
- **Dépôt de projets** : Soumission de travaux (PDF/ZIP, max 50 Mo) avec titre, description, tags, visibilité.
- **Mes Dépôts** : Gestion des projets (modifier, supprimer, historique).
- **Bourses** : Candidature et suivi des bourses M2/Doctorat (formulaire, documents, statut).
- **Mon Compte** : Gestion du profil (nom, statut, parcours).
- **À propos** : Mission et vision panafricaine.
- **Connexion/Inscription** : Authentification sécurisée.
- **Responsive** : Adapté à mobile, tablette, desktop.
- **Accessibilité** : Contrastes WCAG, navigation clavier.

## Structure

```
griote-foundation/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── griote.svg
│   │   ├── bogolan-pattern.png
│   │   └── kente-pattern.png
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── Layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ui/
│   │   └── WhyGrioteSection.tsx
│   ├── pages/
│   │   ├── APropos.tsx
│   │   ├── Connexion.tsx
│   │   ├── Depot.tsx
│   │   ├── Bourses.tsx
│   │   ├── Index.tsx
│   │   ├── Inscription.tsx
│   │   ├── NotFound.tsx
│   │   └── Recherche.tsx
│   ├── styles/
│   │   └── griote.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/brandoniscoding/griote-foundation.git
   cd griote-foundation
   ```

2. Installez les dépendances :
   ```bash
   pnpm install
   ```

3. Configurez l’environnement :
   - Créez un fichier `.env` :
     ```env
     VITE_API_URL=https://griote-backend.example.com/api
     ```

4. Lancez le frontend :
   ```bash
   pnpm dev
   ```
   Accédez à `http://localhost:5173`.

## Contribution

1. Forkez le dépôt.
2. Créez une branche : `git checkout -b feature/nouvelle-fonctionnalite`.
3. Commitez vos changements : `git commit -m "Ajout de nouvelle-fonctionnalite"`.
4. Poussez : `git push origin feature/nouvelle-fonctionnalite`.
5. Ouvrez une pull request sur GitHub.

## Technologies

- **React** : v18
- **TypeScript** : Typage statique
- **Vite** : Build rapide
- **Tailwind CSS** : Styles utilitaires
- **Lucide React** : Icônes
- **React Router** : Navigation

## Backend

Pour le backend, consultez le dépôt séparé : [griote-foundation-backend](https://github.com/brandoniscoding/griote-foundation-backend).

## Contact

Ouvrez une issue sur GitHub pour toute question ou suggestion.