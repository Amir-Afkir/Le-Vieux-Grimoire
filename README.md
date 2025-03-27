# Mon Vieux Grimoire - Backend

Projet de développement du **back-end** pour un site de notation de livres, réalisé avec **Node.js**, **Express**, **MongoDB**, **Mongoose**, **JWT**, **Multer** et **Sharp**.

---

## 🚀 Fonctionnalités principales

- Authentification sécurisée (inscription / connexion)
- Ajout, modification, suppression de livres
- Notation des livres (0 à 5 étoiles)
- Calcul automatique de la note moyenne
- Optimisation automatique des images (compression avec Sharp)
- Système d’autorisation basé sur le token JWT

---

## 🛠️ Technologies utilisées

- **Node.js** & **Express** – Serveur web
- **MongoDB** & **Mongoose** – Base de données NoSQL
- **JWT (jsonwebtoken)** – Authentification
- **Multer** – Upload de fichiers
- **Sharp** – Compression d’images
- **dotenv** – Variables d’environnement

---

## 📁 Structure du projet

```
mon-vieux-grimoire/
├── grimoire-backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── images/
│   ├── .env
│   └── server.js
└── grimoire-frontend/
```

---

## ⚙️ Installation

1. Clonez ce dépôt :

```bash
git clone https://github.com/votre-utilisateur/mon-vieux-grimoire.git
cd mon-vieux-grimoire
```

2. Installez les dépendances pour le backend :

```bash
cd grimoire-backend
npm install
```

3. Installez les dépendances pour le frontend :

```bash
cd ../grimoire-frontend
npm install
```

---

## 🔑 Configuration

Créez un fichier `.env` dans `grimoire-backend/` :

```env
PORT=4000
MONGODB_URI=Votre_URL_MongoDB
TOKEN_SECRET=Votre_Clé_Secrète_JWT
```

---

## ▶️ Lancer le projet

Depuis le dossier racine, exécutez :

```bash
npm install concurrently --save-dev
npm init -y
```

Puis, dans le fichier `package.json` de la racine, ajoutez :

```json
"scripts": {
  "dev": "concurrently \"npm run dev --prefix grimoire-backend\" \"npm start --prefix grimoire-frontend\""
}
```

Ensuite :

```bash
npm run dev
```

---

## 📦 Endpoints de l’API

### Auth

| Méthode | Endpoint             | Données                         | Réponse attendue                   |
|---------|----------------------|----------------------------------|------------------------------------|
| POST    | /api/auth/signup     | { email, password }              | { message }                        |
| POST    | /api/auth/login      | { email, password }              | { userId, token }                  |

### Livres

| Méthode | Endpoint                  | Auth | Description                                          |
|---------|---------------------------|------|------------------------------------------------------|
| GET     | /api/books                | ❌   | Récupère tous les livres                             |
| GET     | /api/books/:id            | ❌   | Récupère un livre par ID                             |
| GET     | /api/books/bestrating     | ❌   | Récupère les 3 livres les mieux notés                |
| POST    | /api/books                | ✅   | Crée un livre (image + données)                     |
| PUT     | /api/books/:id            | ✅   | Modifie un livre (optionnellement image)            |
| DELETE  | /api/books/:id            | ✅   | Supprime un livre                                    |
| POST    | /api/books/:id/rating     | ✅   | Note un livre                                        |

---

## ♻️ Green Code

Les images sont automatiquement compressées avec `Sharp` avant d’être sauvegardées sur le serveur.

---

## 👨‍💻 Auteur

Projet réalisé par **Amir Afkir** dans le cadre de la formation OpenClassrooms - Développeur Web.

---

## 📝 Licence

Projet à usage pédagogique uniquement.
