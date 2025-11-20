# Mise à jour Frontend - Système d'Authentification et Gestion des Utilisateurs

## Date: 18 Octobre 2025

## 📋 Résumé des Changements

Migration complète du frontend pour correspondre au nouveau système de rôles simplifié (USER/ADMIN) du backend.

---

## 🎯 Nouvelles Fonctionnalités

### 1. **Service d'Authentification Mis à Jour**
**Fichier:** `src/services/auth.service.ts`

- ✅ Mise à jour des interfaces `User` avec les nouveaux rôles: `'USER' | 'ADMIN'`
- ✅ Ajout des champs optionnels: `date_of_birth`, `bio`, `linkedin_url`, `github_url`, `website_url`, `created_at`, `updated_at`
- ✅ URL API mise à jour: `http://localhost:3000/api` (port 3000 au lieu de 3001)
- ✅ Support des nouveaux champs de profil dans `RegisterData`

### 2. **Nouveau Service Utilisateur**
**Fichier:** `src/services/user.service.ts` (NOUVEAU)

**Fonctionnalités:**
- `getProfile()` - Récupérer le profil de l'utilisateur connecté
- `updateProfile(data)` - Mettre à jour le profil
- `changePassword(oldPassword, newPassword)` - Changer le mot de passe

### 3. **Nouveau Service Admin**
**Fichier:** `src/services/admin.service.ts` (NOUVEAU)

**Fonctionnalités:**
- `getAllUsers(filters)` - Liste des utilisateurs avec filtres (page, limit, role, email, name)
- `getUserById(userId)` - Détails d'un utilisateur
- `updateUser(userId, data)` - Mettre à jour un utilisateur
- `updateUserRole(userId, role)` - Changer le rôle (USER ↔ ADMIN)
- `resetUserPassword(userId, newPassword)` - Réinitialiser le mot de passe
- `deleteUser(userId)` - Supprimer un utilisateur
- `getPlatformStats()` - Statistiques de la plateforme
- `createAdmin(adminData)` - Créer un nouveau compte admin

### 4. **Page Mon Compte (Profil Utilisateur)**
**Fichier:** `src/pages/MonCompte.tsx` (NOUVEAU)

**Caractéristiques:**
- 📱 Design moderne avec onglets (Profil / Sécurité)
- ✏️ Modification des informations personnelles
- 🔗 Ajout de liens professionnels (LinkedIn, GitHub, Site Web)
- 🔒 Changement de mot de passe sécurisé
- 🚪 Déconnexion
- 🎨 Interface conforme à la charte graphique Griote

**Onglet Profil:**
- Prénom, Nom
- Date de naissance
- Bio
- LinkedIn URL
- GitHub URL
- Site Web

**Onglet Sécurité:**
- Changement de mot de passe avec validation
- Affichage/masquage des mots de passe
- Bouton de déconnexion

### 5. **Page Inscription Mise à Jour**
**Fichier:** `src/pages/Inscription.tsx`

**Changements:**
- ❌ Suppression des champs téléphone et pays
- ❌ Suppression de la sélection de type de profil (Student/Teacher/Independent)
- ✅ Ajout d'un champ "Bio" optionnel
- ✅ Validation complète du mot de passe avec regex
- ✅ Messages d'erreur et de succès améliorés
- ✅ Intégration avec le service d'authentification réel
- ✅ Redirection automatique après inscription

**Règles de mot de passe:**
- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial (@$!%*?&)

### 6. **AdminDashboard Mis à Jour**
**Fichier:** `src/pages/admin/AdminDashboard.tsx`

**Changements:**
- ✅ Intégration avec `adminService` au lieu de `authService`
- ✅ Badge de rôle mis à jour: `USER` (bleu) et `ADMIN` (rouge)
- ✅ Suppression des anciens rôles (STUDENT, TEACHER, INDEPENDENT)
- ✅ Import de types depuis les services centralisés

### 7. **UserModal Mis à Jour**
**Fichier:** `src/components/admin/UserModal.tsx`

**Changements:**
- ✅ Utilisation de `adminService` pour les opérations CRUD
- ✅ Import des types `User` depuis `auth.service`
- ✅ Simplification de la logique de mise à jour/création

### 8. **Header/Navigation Mis à Jour**
**Fichier:** `src/components/Layout/Header.tsx`

**Changements:**
- ✅ Lien "Mon Compte" mis à jour vers `/mon-compte`
- ✅ Navigation adaptative selon l'état d'authentification

### 9. **Routes de l'Application**
**Fichier:** `src/App.tsx`

**Nouvelle route protégée:**
```typescript
<Route path="/mon-compte" element={
  <ProtectedRoute>
    <MonCompte />
  </ProtectedRoute>
} />
```

### 10. **Configuration**
**Fichier:** `.env`

```env
VITE_API_URL=http://localhost:3000/api
```
Port mis à jour de 3001 → 3000 pour correspondre au backend.

---

## 🎨 Respect de la Charte Graphique

Toutes les pages et composants respectent le guide de style Griote:

✅ **Couleurs principales:**
- Bleu principal: `griote-blue`
- Bleu foncé: `griote-blue-dark`
- Jaune accent: `griote-accent` (sur fond bleu uniquement)
- Blanc: `griote-white`
- Texte: `griote-gray-800`

✅ **Boutons:**
- Principaux: `bg-griote-accent text-griote-blue-dark hover:bg-yellow-400`
- Outline: `border-griote-accent text-griote-accent hover:bg-griote-accent hover:text-griote-blue-dark`

✅ **Accessibilité:**
- Contraste minimum WCAG AA respecté
- Pas de texte jaune sur fond blanc
- Tous les états interactifs sont visibles

---

## 🔐 Sécurité

### Protection des Routes
- Routes utilisateur protégées avec `<ProtectedRoute>`
- Routes admin protégées avec `<ProtectedRoute adminOnly>`
- Redirection automatique vers `/connexion` si non authentifié

### Gestion des Tokens
- Access tokens: 15 minutes
- Refresh tokens: 7 jours
- Rafraîchissement automatique avec retry logic
- Stockage sécurisé dans localStorage

### Validation
- Validation des formulaires côté client
- Messages d'erreur clairs et explicites
- Protection contre les injections

---

## 📝 Interfaces TypeScript

### User
```typescript
interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  is_email_verified: boolean;
  date_of_birth?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  created_at?: string;
  updated_at?: string;
}
```

### RegisterData
```typescript
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
  date_of_birth?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
}
```

---

## 🚀 Démarrage

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

Le frontend sera accessible sur `http://localhost:5173`

---

## 🔄 Flux d'Authentification

### Inscription
1. Utilisateur remplit le formulaire d'inscription
2. Validation du mot de passe (complexité requise)
3. Appel API: `POST /api/auth/register`
4. Email de vérification envoyé
5. Redirection vers `/connexion`

### Connexion
1. Utilisateur entre email/mot de passe
2. Appel API: `POST /api/auth/login`
3. Réception des tokens (access + refresh)
4. Si admin: redirection vers `/interface-selection`
5. Si user: redirection vers `/`

### Accès au Profil
1. Utilisateur connecté clique sur "Mon Compte"
2. Chargement des données depuis le backend
3. Affichage du profil avec tous les champs
4. Modification et sauvegarde en temps réel

---

## 📦 Dépendances Principales

- **React 18.3.1** - Framework UI
- **React Router 6.26.2** - Routing
- **@tanstack/react-query 5.56.2** - State management
- **Radix UI** - Composants accessibles
- **Tailwind CSS 3.4.11** - Styling
- **Lucide React** - Icônes
- **Sonner** - Notifications toast
- **Zod 3.23.8** - Validation

---

## 🐛 Débogage

### Problèmes Courants

**1. Erreur de connexion au backend**
- Vérifier que le backend tourne sur le port 3000
- Vérifier `.env`: `VITE_API_URL=http://localhost:3000/api`

**2. Token expiré**
- Le refresh token se renouvelle automatiquement
- En cas d'échec, l'utilisateur est redirigé vers `/connexion`

**3. Problèmes de CORS**
- Vérifier la configuration CORS du backend
- S'assurer que `localhost:5173` est autorisé

---

## 📱 Responsive Design

Toutes les pages sont entièrement responsives:
- 📱 Mobile: < 768px
- 💻 Tablette: 768px - 1024px
- 🖥️ Desktop: > 1024px

---

## ✅ Tests Recommandés

### Authentification
- [ ] Inscription avec mot de passe valide
- [ ] Inscription avec mot de passe invalide
- [ ] Connexion utilisateur
- [ ] Connexion admin
- [ ] Déconnexion

### Profil Utilisateur
- [ ] Affichage du profil
- [ ] Modification des informations
- [ ] Ajout de liens sociaux
- [ ] Changement de mot de passe
- [ ] Validation des champs

### Admin
- [ ] Accès au dashboard admin
- [ ] Liste des utilisateurs
- [ ] Modification d'un utilisateur
- [ ] Changement de rôle
- [ ] Suppression d'utilisateur
- [ ] Affichage des statistiques

---

## 🔗 Routes de l'Application

| Route | Accès | Description |
|-------|-------|-------------|
| `/` | Public | Page d'accueil |
| `/recherche` | Public | Recherche de projets |
| `/a-propos` | Public | À propos |
| `/annonces` | Public | Annonces |
| `/connexion` | Public | Connexion |
| `/inscription` | Public | Inscription |
| `/mon-compte` | Protégé (USER/ADMIN) | Profil utilisateur |
| `/interface-selection` | Protégé (ADMIN) | Sélection d'interface |
| `/admin/dashboard` | Protégé (ADMIN) | Dashboard administrateur |

---

## 📞 Support

Pour toute question ou problème, consulter:
- Documentation backend: `user-service/README.md`
- Guide de migration: `user-service/MIGRATION_USER_ROLES.md`
- Guide de style: `STYLE_GUIDE.md`

---

**Auteur:** Team Griote Foundation  
**Version:** 2.0.0  
**Date:** 18 Octobre 2025
