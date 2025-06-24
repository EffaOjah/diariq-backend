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
├── middleware/          # Auth & error handling
├── models/              # (Optional) DB logic
├── routes/              # API endpoints
├── utils/               # Token & email helpers
├── .env                 # Environment variables
├── app.js               # Express app config
├── server.js            # Entry point
```

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/diariq-backend.git
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
CLIENT_URL=http://localhost:3000
```

---

## 🧪 Running the App

```bash
npm run dev     # with nodemon
yarn start      # normal start
```

---

## 🛠️ Endpoints

### 📌 Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
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
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  name VARCHAR(255),
  provider VARCHAR(50),
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `diary_entries`

```sql
CREATE TABLE diary_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
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
  id INT AUTO_INCREMENT PRIMARY KEY,
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
You’ll need to use an app password or a service like Mailgun in production.

---

## 📌 Todos / Next Up

* Rate limiting for auth routes
* Password reset flow
* JWT refresh token support
* Optional email confirmation at signup

---

## 👨‍💻 Author

Effa Ojah

---

## 📄 License

MIT
