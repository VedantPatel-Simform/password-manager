# Password Manager

A secure, zero-knowledge password management application built with modern web technologies and client-side encryption.

## Security Architecture

This password manager implements a **zero-knowledge architecture**, ensuring that your master password and encryption keys never leave your device in plain text. The server never has access to your unencrypted data.

### Encryption Flow
1. **Data Encryption Key (DEK)** - Generated client-side to encrypt/decrypt your password data
2. **Password Encryption Key (PEK)** - Encrypts the DEK, then gets encrypted with your master password + random salt , that salt will be stored in database .
3. **Salt-based Protection** - Random salt stored in database, combined with master password for key derivation
4. **Client-side Decryption** - All decryption happens in your browser using keys stored only in memory, server can't see any encryption keys ever.

#### The encryption algorithm used is AES-256-GCM mode which provides authentication alongside encryption
#### This project is using Web Crypto API to handle fast encryption decryption on client side

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

## Features

### User Authentication & Security
- **Secure Registration**: Generates encryption keys during signup
- **Zero-Knowledge Login**: Server never sees your master password or encryption keys
- **Client-side Key Management**: All encryption/decryption happens in your browser

### Password Management
- **Password Generation**: Create strong passwords and passphrases on the frontend
- **Strength Analysis**: Integrated zxcvbn library for real-time password strength checking
- **Secure Storage**: Passwords encrypted client-side before sending to server

### Password Dashboard
- **View & Copy**: Easily view and copy passwords and associated emails
- **Edit Passwords**: Update password details with automatic re-encryption
- **Advanced Search**: 
  - Sort by creation/update date
  - Filter by category
  - Fuzzy search using Fuse.js

### Recycle Bin :
- **Send passwords to recycle bin** and restore it again when needed
- **30 Days** limit in recycle bin alongside displaying how many days left
- **Restore** the passwords when required
- **Implemented soft delete** in the database for recycle bin feature
- **Permenant Delete confirmation** from user before permenantly deleting the password.

## Upcoming Features

- **Password Sharing**: Share passwords securely with other users
- **Shared Vaults**: Create collaborative password vaults with team members
- **Password Analytics**: 
  - Password strength analysis
  - Breach detection and monitoring
  - Security recommendations

## Security Features

- **Zero-Knowledge Architecture**: Server cannot access your unencrypted data
- **Client-side Encryption**: All sensitive operations happen in your browser
- **Argon2id Hashing**: Industry-standard password hashing algorithm
- **Salt-based Key Derivation**: Additional protection against rainbow table attacks
- **Memory-only Key Storage**: Encryption keys never persist on disk

## Usage

1. **Register** with a strong master password
2. **Login** to access your encrypted vault
3. **Password Generator** to generate passwords and passphrases
4. **Add passwords** using the secure password generator
5. **Organize** your passwords with categories and tags
6. **Search** through your passwords with advanced filtering options

## Important Links : 
[Database Link](https://dbdiagram.io/d/Password_Manager-67f607724f7afba184e292f9)

[Documentation Link](https://simformsolutionspvtltd-my.sharepoint.com/:w:/g/personal/vedant_patel_simformsolutions_com/EVTHWDVyccBBmo1WSf7sU5wBs57zJGanEeCoxzUZmTeV-w)
