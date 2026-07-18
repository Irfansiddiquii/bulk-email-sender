# 🚀 Bulk Email Sender - SvelteKit Frontend Migration Project

## 📋 Project Overview

This project has been migrated from a **Hono (Bun)** backend serving vanilla HTML files to:
- **Backend**: Pure Node.js runtime using Hono's `@hono/node-server`, `better-sqlite3`, and `tsx` watcher.
- **Frontend**: A modern **SvelteKit** application powered by **Tailwind CSS**, **TipTap WYSIWYG**, and **Lucide Svelte** icons.

---

## 🏗️ Architecture & Folder Structure

```text
├── data/                  # SQLite Databases (users.db, scheduler.db)
├── uploads/               # Excel attachment uploads directory
├── logs/                  # Dispatch audit logs directory
├── src/                   # Backend Node.js API codebase (Hono)
│   ├── services/          # SQLite user/batch/scheduler service modules
│   ├── middleware/        # Authentication sessions validation
│   └── app.ts             # Application entrypoint using @hono/node-server
├── frontend/              # SvelteKit Single Page Application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api/       # Central Axios client configuration
│   │   │   ├── stores/    # Auth, SMTP Configs, and Toast alerts state
│   │   │   └── components/# TipTap rich-text editor wrapper
│   │   ├── routes/        # App page routes (login, register, configs, compose, reports)
│   │   ├── app.html       # HTML entry shell
│   │   └── app.css        # Tailwind utility loader
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── vite.config.ts     # Vite proxy forwarding API endpoints to backend
└── package.json           # Backend dependencies and scripts
```

---

## ⚡ Development & Running Setup

Follow these steps to run the application locally.

### 1. Backend Server Setup
From the project root workspace directory:
```bash
# 1. Install Node.js backend dependencies
npm install

# 2. Start Hono API server in watch mode (running on port 3000)
npm run dev
```

### 2. Frontend SvelteKit Setup
In a new terminal window:
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install SvelteKit dependencies
npm install

# 3. Start SvelteKit development server (running on port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to experience the migrated, premium application.

---

## 🧹 Legacy Frontend Removal

The legacy public static files are now obsolete. You can delete the `public` directory from the root directory:
```bash
rm -rf public
```

---

## 📡 API Reference

- **Auth Routes**:
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `POST /auth/logout` - User logout
  - `GET /user/info` - Get current session user info
- **SMTP Configuration**:
  - `GET /config/smtp` - Retrieve SMTP configurations
  - `POST /config/smtp` - Add new SMTP configuration
  - `PUT /config/smtp/:id` - Update SMTP configuration
  - `DELETE /config/smtp/:id` - Delete SMTP configuration
  - `POST /config/smtp/:id/default` - Set SMTP configuration as primary default
  - `POST /config/smtp/test` - Diagnostic connection test
- **Campaign Sends**:
  - `POST /send` - Dispatch/schedule campaign (Multi-part form)
  - `POST /parse-excel` - Recipient spreadsheet parse check
  - `GET /scheduled-jobs` - Get pending schedule lists
  - `DELETE /scheduled-jobs/:id` - Cancel scheduled email job
- **Batch Monitoring**:
  - `GET /batch-status` - Active progress percentage checks
  - `POST /batch-pause` - Pause sending loop
  - `POST /batch-resume` - Resume sending loop
  - `DELETE /batch-cancel` - Clear batch queue
- **Analytics & Logs**:
  - `GET /report` - Log list & statistics counters
  - `GET /report/export/csv` - Download CSV stream
  - `GET /report/export/json` - Download JSON stream
  - `DELETE /report/clear` - Reset log history

