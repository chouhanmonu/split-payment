# Split Payments

An intuitive app that streamlines splitting and tracking shared expenses among friends.

## Project Overview

Developed a user-centric mobile application for effortlessly splitting and tracking shared expenses among friends, families, or groups. Drawing from real-world frustrations with existing apps, like clunky interfaces and intrusive ads, this solution prioritizes simplicity, speed, and security to make financial collaboration feel natural and hassle-free, supporting everything from casual dinners to trip budgets.

## Key Features

- **Seamless User Onboarding**: Quick login/signup via email, Google OAuth, or multi-device support, with asymmetric JWT tokens for secure, stateless authentication.
- **Intuitive Group Management**: Create groups in seconds, add members using unique, human-readable IDs, and track balances with clear visualizations of owed/borrowed amounts.
- **Effortless Transaction Handling**: One-tap expense entry, automatic splitting algorithms (e.g., equal or custom shares), and real-time balance updates to avoid disputes.
- **Ad-Free Experience**: No disruptive ads; instead, a generous daily limit on free transactions to encourage organic use without aggressive monetization.
- **Accessibility-Focused UI**: Clean, age-agnostic design ensuring ease for all users, from tech-savvy millennials to less digital-native seniors.

Here’s a clean **Getting Started** section you can drop directly into your project README. I’ve structured it clearly and used **placeholders** for sensitive values while still explaining Google SMTP and OpenSSL-based asymmetric JWT setup.

## Getting Started

### Prerequisites

Before setting up the project, ensure you have the following installed on your system:

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn/pnpm if you prefer)
- **PostgreSQL** ≥ 14
- **OpenSSL** (for generating asymmetric JWT keys)
- A **Google account** with SMTP access enabled (App Password required)
- **NestJS CLI** (optional but recommended)

```bash
npm install -g @nestjs/cli
```

---

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd split-payment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

---

### Configuration

Create a `.env` file in the root of the project and configure the following environment variables.

#### Application

```env
WEB_APP_URL=https://your-frontend-url.com // optional
```

#### Email

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-google-app-password
EMAIL_FROM="APP NAME <your-email@gmail.com>"
```

#### Database (PostgreSQL)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-db-password
DB_NAME=split_payment
```

Make sure the database exists before running the app:

```sql
CREATE DATABASE split_payment;
```

---

#### JWT (Asymmetric Keys)

This project uses **asymmetric JWT signing (RS256)** with a **public/private key pair** generated using OpenSSL.

##### Generate Keys

```bash
# Generate private key
openssl genrsa -out jwt-private.key 2048

# Generate public key
openssl rsa -in jwt-private.key -pubout -out jwt-public.key
```

##### Add Keys to `.env`

> Keys must be **multiline** and preserved exactly as generated.

```env
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_CONTENT
-----END PRIVATE KEY-----"

JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
YOUR_PUBLIC_KEY_CONTENT
-----END PUBLIC KEY-----"
```

These keys are used for:

- Signing JWTs with the **private key**
- Verifying JWTs with the **public key**

---

### Running Locally

#### Development Mode (Watch)

```bash
npm run start:dev
```

#### Debug Mode

```bash
npm run start:debug
```

#### Production Build

```bash
npm run build
npm run start:prod
```

The server will start at:

```
http://localhost:3000
```

GraphQL playground (if enabled):

```
http://localhost:3000/graphql
```

---

✅ You’re now ready to run the **Split Payment** backend locally.
