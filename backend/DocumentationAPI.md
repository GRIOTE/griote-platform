# Griote Foundation Backend - Documentation des Microservices

##  Table des Matières
- [Architecture Générale](#architecture-générale)
- [Auth-Service](#auth-service)
- [Profile-Service](#profile-service)
- [Communication Inter-Services](#communication-inter-services)
- [Base de Données](#base-de-données)
- [Déploiement](#déploiement)

---

##  Architecture Générale

### Services Disponibles
- **Auth-Service** : Port 3001 - Gestion de l'authentification
- **Profile-Service** : Port 3002 - Gestion des profils utilisateurs
- **RabbitMQ** : Port 5672 (AMQP) + 15672 (Management UI)
- **PostgreSQL Auth** : Port 5432
- **PostgreSQL Profile** : Port 5433

---

## 🔐 Auth-Service (Port 3001)

### Base URL
```
http://localhost:3001
```

### Endpoints

#### 1. Health Check
```http
GET /health
```
**Réponse :** `{ "ok": true }`

#### 2. Inscription Utilisateur
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "string (2-100 chars)",
  "lastName": "string (2-100 chars)",
  "email": "valid email",
  "password": "min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (@$!%*?&)",
  "profileType": "Student" | "Teacher" | "Independent"
}
```
**Réponse :** `201 Created` - `{ "message": "User created. Please verify your email." }`

#### 3. Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```
**Réponse :** `200 OK`
```json
{
  "accessToken": "JWT token (15min)",
  "refreshToken": "JWT token (7 jours)",
  "userId": "number",
  "profileType": "string"
}
```

#### 4. Rafraîchissement de Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "string"
}
```
**Réponse :** `200 OK`
```json
{
  "accessToken": "nouveau JWT",
  "refreshToken": "nouveau JWT"
}
```

#### 5. Déconnexion
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "string"
}
```
**Réponse :** `200 OK` - `{ "message": "Logged out" }`

#### 6. Vérification Email
```http
GET /api/auth/verify-email?token=JWT_TOKEN
```
**Réponse :** `200 OK` - `{ "message": "Email verified. You can now login." }`

#### 7. Demande Reset Password
```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "string"
}
```
**Réponse :** `200 OK` - `{ "message": "If your email exists in our system, a password reset link has been sent." }`

#### 8. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "JWT token",
  "newPassword": "string (min 8 chars)",
  "confirmPassword": "string (doit matcher newPassword)"
}
```
**Réponse :** `200 OK` - `{ "message": "Password has been reset successfully." }`

---

##  Profile-Service (Port 3002)

### Base URL
```
http://localhost:3002
```

### Authentification
**Toutes les routes nécessitent un header d'autorisation :**
```
Authorization: Bearer JWT_ACCESS_TOKEN
```

### Endpoints

#### 1. Health Check
```http
GET /health
```
**Réponse :** `{ "ok": true }`

#### 2. Créer un Profil
```http
POST /api/profile
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "phoneNumber": "string (optionnel)",
  "country": "string (optionnel)",
  "city": "string (optionnel)",
  "birthDate": "YYYY-MM-DD (optionnel)",
  "avatarUrl": "string (optionnel)",
  "bio": "string (optionnel)",
  "linkedinUrl": "string (optionnel)",
  "youtubeUrl": "string (optionnel)",
  "personalWebsite": "string (optionnel)"
}
```
**Réponse :** `201 Created` - Profil créé

#### 3. Récupérer le Profil
```http
GET /api/profile
Authorization: Bearer JWT_TOKEN
```
**Réponse :** `200 OK` - Données du profil

#### 4. Mettre à Jour le Profil
```http
PUT /api/profile
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "city": "string",
  "bio": "string"
}
```
**Réponse :** `200 OK` - Profil mis à jour

#### 5. Supprimer le Profil
```http
DELETE /api/profile
Authorization: Bearer JWT_TOKEN
```
**Réponse :** `200 OK` - Profil supprimé

#### 6. Lister Tous les Profils
```http
GET /api/profile/list
Authorization: Bearer JWT_TOKEN
```
**Réponse :** `200 OK` - Liste des profils

---

##  Communication Inter-Services

### RabbitMQ Events

#### Événements Publiés par Auth-Service

// Exchange: user_events (fanout)
{
  "event": "UserCreated",
  "data": {
    "id": "number",
    "email": "string",
    "profileType": "string"
  }
}
```

#### Événements Consommés par Profile-Service
- **USER_CREATED** : Création automatique d'un profil vide
- **USER_UPDATED** : Mise à jour du profil existant

### Configuration RabbitMQ
```env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

---

##  Base de Données

### Auth-Service Database (authdb)

-- Table users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  "profileType" ENUM('Student','Teacher','Independent') NOT NULL,
  "isVerified" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Table refreshTokens
CREATE TABLE "refreshTokens" (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  "userId" INTEGER REFERENCES users(id),
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

### Profile-Service Database (profiledb)
```sql
-- Table profiles
CREATE TABLE profiles (
  "userId" INTEGER PRIMARY KEY,
  "phoneNumber" VARCHAR(20),
  country VARCHAR(100),
  city VARCHAR(100),
  "birthDate" DATE,
  "avatarUrl" TEXT,
  bio TEXT,
  "linkedinUrl" TEXT,
  "youtubeUrl" TEXT,
  "personalWebsite" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

---

##  Déploiement

### Variables d'Environnement

#### Auth-Service (.env)
```env
DB_URI=postgres://authuser:authpassword@db-auth:5432/authdb
JWT_SECRET=your_super_secret_jwt_key_here
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
EMAIL_FROM_NAME=Griote Foundation


#### Profile-Service (.env)
```env
DB_URI=postgres://profileuser:profilepassword@db-profile:5432/profiledb
JWT_SECRET=your_super_secret_jwt_key_here
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
LOG_LEVEL=info


### Docker Compose

# Démarrer tous les services
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down



## 🔧 Intégration avec d'Autres Microservices

### 1. Ajouter un Nouveau Service
```yaml
# docker-compose.yaml
new-service:
  build: ./new-service
  ports:
    - "3003:3000"
  env_file:
    - ./new-service/.env
  depends_on:
    - db-new
    - rabbitmq
```

### 2. Consommer les Événements RabbitMQ

// new-service/src/events/rabbitmq.consumer.js
const amqp = require('amqplib');

async function startConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  
  const queue = 'user.events';
  await channel.assertQueue(queue, { durable: true });
  
  channel.consume(queue, async (msg) => {
    const event = JSON.parse(msg.content.toString());
    
    switch (event.type) {
      case 'USER_CREATED':
        // Logique métier
        break;
    }
    
    channel.ack(msg);
  });
}
```

### 3. Publier des Événements

// new-service/src/events/rabbitmq.publisher.js
const amqp = require('amqplib');

async function publishEvent(eventType, data) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  
  const exchange = 'user_events';
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  
  const message = Buffer.from(JSON.stringify({
    event: eventType,
    data: data
  }));
  
  channel.publish(exchange, '', message);
}
```

---

##  Monitoring et Logs

### Health Checks
- **Auth-Service** : `GET http://localhost:3001/health`
-