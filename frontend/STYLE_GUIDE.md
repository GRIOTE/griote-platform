# Guide de Style - Fondation Griote

## Règles de Contraste des Couleurs

### ✅ Combinaisons AUTORISÉES

#### Jaune (Accent) - Toujours avec du bleu foncé
- `bg-griote-accent text-griote-blue-dark` ✅
- `bg-griote-accent text-griote-blue` ✅
- `text-griote-accent` uniquement sur fond bleu foncé ✅

#### Bleu - Jamais sur jaune
- `bg-griote-blue text-griote-white` ✅
- `bg-griote-blue-dark text-griote-white` ✅
- `text-griote-blue` sur fond blanc ✅
- `text-griote-blue-dark` sur fond blanc ✅

#### Blanc/Gris
- `bg-griote-white text-griote-gray-800` ✅
- `bg-griote-gray-50 text-griote-gray-800` ✅

### ❌ Combinaisons INTERDITES

#### Jaune sur blanc ou gris clair
- `bg-griote-white text-griote-accent` ❌
- `bg-griote-gray-50 text-griote-accent` ❌
- `text-griote-accent` sur fond blanc ❌

#### Bleu sur jaune
- `bg-griote-accent text-griote-blue` ❌ (utiliser text-griote-blue-dark)
- `bg-griote-accent text-griote-blue-light` ❌

## Classes CSS Recommandées

### Boutons
```css
/* Bouton principal */
.griote-button {
  @apply bg-griote-accent text-griote-blue-dark hover:bg-yellow-400 hover:text-griote-blue-dark;
}

/* Bouton outline */
.griote-button-outline {
  @apply border-2 border-griote-accent text-griote-accent hover:bg-griote-accent hover:text-griote-blue-dark;
}
```

### Liens
```css
/* Sur fond blanc */
.link-on-white {
  @apply text-griote-blue hover:text-griote-blue-dark;
}

/* Sur fond bleu */
.link-on-blue {
  @apply text-griote-accent hover:text-yellow-300;
}
```

### Texte
```css
/* Titre principal */
.main-title {
  @apply text-griote-blue-dark font-bold;
}

/* Texte de corps */
.body-text {
  @apply text-griote-gray-800;
}

/* Texte d'accent (uniquement sur fond bleu) */
.accent-text {
  @apply text-griote-accent; /* Utiliser uniquement sur bg-griote-blue ou bg-griote-blue-dark */
}
```

## Palette de Couleurs

### Couleurs Principales
- **Bleu principal** : `#3B82F6` (griote-blue)
- **Bleu foncé** : `#1E3A8A` (griote-blue-dark)
- **Bleu clair** : `#DBEAFE` (griote-blue-light)
- **Jaune accent** : `#FFDE59` (griote-accent)
- **Blanc** : `#FFFFFF` (griote-white)

### Couleurs de Texte
- **Texte principal** : `#1F2937` (griote-gray-800)
- **Texte secondaire** : `#4B5563` (griote-gray-600)
- **Texte sur fond bleu** : `#FFFFFF` (griote-white)
- **Texte accent** : `#FFDE59` (griote-accent) - uniquement sur fond bleu

## Exemples d'Utilisation

### ✅ Bon Contraste
```jsx
// Bouton principal
<Button className="bg-griote-accent text-griote-blue-dark">
  Action Principale
</Button>

// Lien sur fond blanc
<Link className="text-griote-blue hover:text-griote-blue-dark">
  Lien
</Link>

// Texte accent sur fond bleu
<div className="bg-griote-blue text-griote-white">
  <span className="text-griote-accent">Texte en surbrillance</span>
</div>
```

### ❌ Mauvais Contraste
```jsx
// Jaune sur blanc - difficile à lire
<Link className="text-griote-accent">Lien</Link>

// Bleu clair sur jaune - mauvais contraste
<div className="bg-griote-accent text-griote-blue">
  Texte illisible
</div>
```

## Vérification d'Accessibilité

### Ratios de Contraste Minimum
- **Texte normal** : 4.5:1
- **Texte large** : 3:1
- **Éléments graphiques** : 3:1

### Outils de Vérification
- WebAIM Contrast Checker
- Chrome DevTools Accessibility
- axe DevTools

## Classes Utilitaires Personnalisées

```css
/* Assure un bon contraste pour les liens */
.safe-link {
  @apply text-griote-blue hover:text-griote-blue-dark transition-colors;
}

/* Texte accent sécurisé (avec fond approprié) */
.accent-text-safe {
  @apply bg-griote-blue text-griote-accent px-2 py-1 rounded;
}

/* Badge avec bon contraste */
.accent-badge {
  @apply bg-griote-accent text-griote-blue-dark px-3 py-1 rounded-full font-medium;
}
```

## Checklist de Révision

Avant de valider du code, vérifiez :

- [ ] Aucun texte jaune sur fond blanc/gris clair
- [ ] Aucun texte bleu clair sur fond jaune
- [ ] Les liens ont un contraste suffisant
- [ ] Les boutons utilisent les classes recommandées
- [ ] Les états hover maintiennent un bon contraste
- [ ] Les éléments interactifs sont facilement identifiables

## Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Universal Design](https://jfly.uni-koeln.de/color/)
