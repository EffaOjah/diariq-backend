# Diariq Backend

A secure and scalable Node.js backend for the Diariq journaling web app. Built with Express, MySQL, Passport.js (for Google OAuth), and JWT-based authentication.

---

## 🚀 Features

* Email/password authentication with JWT
* Google social login with Passport.js
* MySQL database using `mysql2/promise`
* Password hashing with bcrypt
* Set password flow for social accounts
* Email verification for setting password
* Clean project structure and modular routing
* Email confirmation at signup

---

## 🧱 Tech Stack

* Node.js
* Express.js
* MySQL
* Passport.js
* JSON Web Tokens
* Nodemailer (for email)
* dotenv

---

## 📁 Folder Structure

```
diariq-backend/
├── config/              # DB and passport setup
├── controllers/         # Route logic
├── extraFunctions/      # extra functions
├── middleware/          # Auth & error handling
├── models/              # (Optional) DB logic
├── routes/              # API endpoints
├── utils/               # Token & email helpers
├── .env                 # Environment variables
├── app.js               # Express app config
├── server.js            # Entry point
├── LICENSE              # MIT license
```

---

## 📦 Installation

```bash
git clone https://github.com/EffaOjah/diariq-backend.git
cd diariq-backend
npm install
```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=diariq
JWT_SECRET=supersecret
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourpassword
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
CLIENT_URL=http://localhost:5000
```

---

## 🧪 Running the App

```bash
npm run dev     # with nodemon
npm start      # normal start
```

---

## 🛠️ Endpoints

### 📌 Auth

* `GET /user/register`
* `POST /user/login`
* `POST /user/register`
* `GET /verify-email`
* `GET /api/auth/google`
* `GET /api/auth/google/callback`
* `POST /api/auth/request-set-password` → sends email link
* `GET /api/auth/verify-set-password?token=` → verifies token
* `POST /api/auth/set-password` → set password for Google accounts

### 📌 Diary

* `GET /api/diary/` → fetch user entries
* `POST /api/diary/` → create entry
* `PUT /api/diary/:id` → update entry
* `DELETE /api/diary/:id` → delete entry

---

## 🗃️ SQL Tables (Core)

### `users`

```sql
CREATE TABLE users (
  user_id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  provider VARCHAR(50) DEFAULT NULL,
  provider_id VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### `diary_entries`

```sql
CREATE TABLE diary_entries (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  content TEXT,
  mood VARCHAR(20),
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### `email_verification_tokens`

```sql
CREATE TABLE email_verification_tokens (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id INT,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## ✉️ Email Sending

Uses Nodemailer to send verification links for setting passwords.

---

## 📌 Todos / Next Up

* Rate limiting for auth routes
* Password reset flow
* JWT refresh token suppor

---

## 👨‍💻 Author

Effa Ojah

---

## 📄 License

MIT
