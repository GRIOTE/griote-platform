
# Griote Foundation Backend
Backend des microservices pour la plateforme Griote Foundation.

## Table des matières

- [Griote Foundation Backend](#griote-foundation-backend)
  - [Table des matières](#table-des-matières)
  - [Description](#description)
  - [Arborescence du projet](#arborescence-du-projet)
  - [Prérequis](#prérequis)
  - [Installation \& Démarrage](#installation--démarrage)
  - [Services](#services)
  - [Variables d’environnement](#variables-denvironnement)
  - [Docker Compose](#docker-compose)
  - [Utilisation](#utilisation)
  - [Licence](#licence)

---

## Description

Ce projet backend est composé de plusieurs microservices indépendants (auth-service, profile-service, bases de données Postgres, RabbitMQ) orchestrés via Docker Compose. Chaque service utilise ses propres variables d’environnement et communique via RabbitMQ et bases Postgres.

---

## Arborescence du projet

```
griote-foundation-backend/
│
├── auth-service/           # Service d'authentification
│   ├── src/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── profile-service/        # Service profil utilisateur
│   ├── src/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── docker-compose.yml      # Orchestration des services (DB, RabbitMQ, microservices)
├── README.md               # Ce fichier
└── volumes/                # Volumes Docker (déclarés dans docker-compose)
```

---

## Prérequis

* Docker (version récente)
* Docker Compose
* Node.js (pour développement local hors Docker)

---

## Installation & Démarrage

1. Clone ce repo
2. Place tes fichiers `.env` correctement dans `auth-service/` et `profile-service/`
3. Lancer les services avec Docker Compose :

```bash
sudo docker compose up --build
```

---

## Services

* **auth-service** : gestion de l’authentification, JWT, connexion à la base authdb
* **profile-service** : gestion des profils utilisateurs, connexion à la base profiledb
* **db-auth** : base PostgreSQL pour auth-service
* **db-profile** : base PostgreSQL pour profile-service
* **rabbitmq** : broker RabbitMQ pour communication asynchrone

---

## Variables d’environnement

Chaque service utilise un fichier `.env` avec ses variables propres, notamment pour DB\_URI, JWT\_SECRET, RabbitMQ URL, etc.

Exemple pour `auth-service/.env` :

```
DB_URI=postgres://authuser:authpass@postgres-auth:5432/authdb
JWT_SECRET=change_this_secret
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
...
```

---

## Docker Compose

Le fichier `docker-compose.yml` orchestre :

* Bases de données (db-auth, db-profile)
* RabbitMQ
* Microservices (auth-service, profile-service)

Chaque microservice importe ses variables d’environnement via son `.env`. Les bases utilisent leurs propres variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` déclarées dans `environment` mais non exposées dans les services.

---

## Utilisation

* Authentification disponible sur `http://localhost:3001/api/auth`
* Profil utilisateur disponible sur `http://localhost:3002`
* RabbitMQ Management UI accessible sur `http://localhost:15672` (guest/guest)

---

## Licence

MIT License
