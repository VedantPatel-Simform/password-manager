# Password Manager

A secure, zero-knowledge password management application built with modern web technologies and client-side encryption.

## Security Architecture

This password manager implements a **zero-knowledge architecture**, ensuring that your master password and encryption keys never leave your device in plain text. The server never has access to your unencrypted data.

### Encryption Flow

1. **Data Encryption Key (DEK)** – Generated client-side to encrypt/decrypt your password data
2. **Password Encryption Key (PEK)** – Encrypts the DEK, then gets encrypted with your master password + random salt; that salt is stored in the database
3. **Salt-based Protection** – Random salt stored in the database, combined with master password for key derivation
4. **Client-side Decryption** – All decryption happens in your browser using keys stored only in memory. The server can never access your encryption keys.

> **Encryption Algorithm**: AES-256-GCM (provides both confidentiality and authentication)
> **Crypto Implementation**: Web Crypto API for fast, secure client-side operations

---

## Tech Stack

**Frontend:**

- Angular
- PrimeNG (UI Components)
- Tailwind CSS (Styling)
- Web Crypto API (Cryptographic functions)

**Backend:**

- Express.js
- MongoDB with Mongoose ODM
- JWT (JSON Web Tokens) for authentication
- Zod for data validation
- Custom error handling middleware

**Security:**

- Argon2id (Password hashing)
- Client-side encryption/decryption
- Zero-knowledge architecture

---

## Features

### User Authentication & Security

- **Secure Registration**: Generates encryption keys during signup
- **Zero-Knowledge Login**: Server never sees your master password or encryption keys
- **Client-side Key Management**: All encryption/decryption happens in your browser

### Password Management

- **Password Generation**: Create strong passwords and passphrases on the frontend
- **Strength Analysis**: Integrated zxcvbn library for real-time password strength checking
- **Secure Storage**: Passwords encrypted client-side before being stored on the server

### CSV Upload

- **Bulk Import Support**: Users can upload a `.csv` file to quickly add multiple passwords
- **Validation Layer**: Each row is validated for required fields like website, username/email, and password
- **Error Reporting Modal**: If validation fails for any rows, a modal appears listing all problematic rows with error messages
- **Client-side Encryption**: Each password from the CSV is encrypted in the browser before being sent to the server
- **Smart Feedback**: Displays the number of successfully added passwords

### Password Dashboard

- **View & Copy**: Easily view and copy passwords and associated emails
- **Edit Passwords**: Update password details with automatic re-encryption
- **Advanced Search**:

  - Sort by creation/update date
  - Filter by category
  - Search Feature

### Password Sharing

- **Secure Sharing**: Share encrypted passwords with other users via their registered email address
- **Expiry Option**: Optionally set an expiry date on shared passwords; if not set, the password remains available indefinitely
- **Encryption Isolation**: Shared passwords are re-encrypted with the recipient’s public key
- **View Shared With You**: Shared passwords appear in a dedicated section (e.g., “Shared With Me”)
- **Audit Metadata**: Includes owner, shared date, and expiry details for transparency

### Recycle Bin

- **Soft Delete**: Deleted passwords are moved to the recycle bin instead of immediate deletion
- **30-Day Limit**: Passwords remain in the recycle bin for 30 days
- **Remaining Days**: UI shows how many days are left before permanent deletion
- **Restore Option**: Restore accidentally deleted passwords with one click
- **Permanent Delete**: Requires confirmation before completely erasing the data

---

## Upcoming Features

- **Password Analytics**:

  - Strength score summaries
  - Breach detection and alerting
  - Security recommendations

- **Revocation of Shared Access**
- **Shared Vault**: User can create a shared vault to share multiple passwords with other users

---

## Security Features

- **Zero-Knowledge Architecture**: Server cannot access your unencrypted data
- **Client-side Encryption**: All sensitive operations happen in your browser
- **Argon2id Hashing**: State-of-the-art password hashing algorithm
- **Salt-based Key Derivation**: Thwarts rainbow table and brute-force attacks
- **Memory-only Key Storage**: No encryption key is stored on disk

---

## Usage

1. **Register** with a strong master password
2. **Login** to access your encrypted vault
3. **Use Password Generator** to create secure credentials
4. **Add and Organize** passwords with categories and tags
5. **Share Passwords** securely with collaborators via email
6. **Import Passwords via CSV** for quick onboarding or migration
7. **Search & Filter** through saved passwords efficiently

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/password-manager.git
cd password-manager
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory and fill in the following:

```env
PORT=3000
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE_TIME=1d
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
CORS_ORIGIN=https://your-frontend-domain.com
AUTO_DELETE_AFTER_SECONDS=2592000  # 30 days in seconds
```

---

### 3. Start the Application

#### Frontend

```bash
cd frontend
npm ci
ng serve
```

#### Backend

```bash
cd backend
npm ci
npm start
```

> The app should now be running at:
>
> - Frontend: `http://localhost:4200`
> - Backend: `http://localhost:3000`

---

## Important Links

- 🔗 [Database Diagram](https://dbdiagram.io/d/Password_Manager-67f607724f7afba184e292f9)
- 📄 [Full Documentation](https://simformsolutionspvtltd-my.sharepoint.com/:w:/g/personal/vedant_patel_simformsolutions_com/EVTHWDVyccBBmo1WSf7sU5wBs57zJGanEeCoxzUZmTeV-w)
