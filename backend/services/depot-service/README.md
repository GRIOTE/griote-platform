# User Service - Griote Foundation

Service de gestion des utilisateurs et d'authentification pour la plateforme Griote Foundation.

## 🚀 Fonctionnalités

- **Authentification JWT** avec access tokens (15 min) et refresh tokens (7 jours)
- **Gestion des utilisateurs** avec 2 rôles : `USER` et `ADMIN`
- **Vérification par email** lors de l'inscription
- **Réinitialisation de mot de passe**
- **Interface d'administration** complète pour la gestion des utilisateurs
- **Statistiques de plateforme**
- **Publication d'événements** via RabbitMQ

## 📋 Prérequis

- Node.js (v16+)
- PostgreSQL
- RabbitMQ (optionnel pour les événements)

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Créer un fichier .env (voir section Configuration)
cp .env.example .env

# Créer un compte administrateur
npm run create-admin
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet :

```env
# Database
DB_URI=postgresql://user:password@localhost:5432/griote_db

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# JWT Expiration
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_EMAIL_EXPIRES_IN=1d

# Server
PORT=3000
LOG_LEVEL=info

# RabbitMQ (optionnel)
RABBITMQ_URL=amqp://localhost

# Email (configuration SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@griote.com
```

## 🏃‍♂️ Démarrage

```bash
# Mode développement avec nodemon
npm run dev

# Mode production
npm start
```

Le service sera accessible sur `http://localhost:3000`

## 🔑 Créer un Administrateur

```bash
# Avec les valeurs par défaut
npm run create-admin

# Avec des valeurs personnalisées
npm run create-admin admin@example.com MyPassword123! John Doe
```

**Valeurs par défaut:**
- Email: `admin@griote.com`
- Password: `AdminPassword123!`
- First Name: `Admin`
- Last Name: `Principal`

## 📚 API Endpoints

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth Required |
|---------|----------|-------------|---------------|
| POST | `/register` | Inscription d'un nouvel utilisateur | Non |
| GET | `/verify-email?token=...` | Vérification de l'email | Non |
| POST | `/login` | Connexion | Non |
| POST | `/refresh` | Rafraîchir l'access token | Non |
| POST | `/logout` | Déconnexion | Non |
| POST | `/request-password-reset` | Demander une réinitialisation de mot de passe | Non |
| POST | `/reset-password` | Réinitialiser le mot de passe | Non |
| POST | `/change-password` | Changer le mot de passe | Oui |

### Utilisateurs (`/api/users`)

| Méthode | Endpoint | Description | Auth Required |
|---------|----------|-------------|---------------|
| GET | `/me` | Obtenir le profil de l'utilisateur actuel | Oui |
| PUT | `/me` | Mettre à jour le profil | Oui |

### Administration (`/api/admin`)

Tous les endpoints admin requièrent le rôle `ADMIN`.

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users` | Liste des utilisateurs (pagination + filtres) |
| GET | `/users/:userId` | Détails d'un utilisateur |
| POST | `/users` | Créer un nouvel administrateur |
| PUT | `/users/:userId` | Mettre à jour un utilisateur |
| PATCH | `/users/:userId/role` | Changer le rôle d'un utilisateur |
| PATCH | `/users/:userId/reset-password` | Réinitialiser le mot de passe d'un utilisateur |
| DELETE | `/users/:userId` | Supprimer un utilisateur |
| GET | `/stats` | Statistiques de la plateforme |

## 🔐 Authentification

### Format des Tokens

Les endpoints protégés requièrent un Bearer token dans le header :

```
Authorization: Bearer <access_token>
```

### Exemple d'Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "bio": "Developer passionate about education"
  }'
```

### Exemple de Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Réponse:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "is_email_verified": true
  },
  "requiresInterfaceSelection": false
}
```

Pour un admin, `requiresInterfaceSelection` sera `true`.

## 👥 Rôles

Le système utilise 2 rôles :

- **USER** : Utilisateur standard (rôle par défaut)
- **ADMIN** : Administrateur avec accès complet

## 📊 Modèle de Données

### Table Users

```javascript
{
  user_id: INTEGER (PK),
  first_name: STRING,
  last_name: STRING,
  email: STRING (unique),
  password_hash: STRING,
  date_of_birth: DATE,
  bio: TEXT,
  linkedin_url: STRING,
  github_url: STRING,
  website_url: STRING,
  role: ENUM('USER', 'ADMIN'),
  is_email_verified: BOOLEAN,
  created_at: DATE,
  updated_at: DATE
}
```

## 🔧 Scripts Disponibles

- `npm start` - Démarrer le serveur en mode production
- `npm run dev` - Démarrer le serveur en mode développement avec nodemon
- `npm run create-admin` - Créer un compte administrateur

## 📝 Logs

Les logs sont enregistrés dans :
- `logs/error.log` - Erreurs uniquement
- `logs/combined.log` - Tous les logs

## 🔄 Migration depuis l'Ancienne Version

Si vous migrez depuis une version avec les rôles `STUDENT`, `TEACHER`, `INDEPENDENT`, consultez le fichier `MIGRATION_USER_ROLES.md` pour les instructions détaillées.

## 🤝 Contribution

Ce service fait partie du projet Griote Foundation. Pour contribuer, veuillez suivre les guidelines du projet principal.

## 📄 Licence

ISC

---

**Auteur:** brandoniscoding  
**Version:** 1.0.0