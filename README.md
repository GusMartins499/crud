# Crud - in progress

## Products API

A simple API for managing products and their respective prices.  
This project is part of a personal roadmap to grow from a **Junior to Mid-level developer**.

---

## Features

- Product CRUD
- List products with their prices
- Health check endpoint

---

## Tech Stack

- Node.js
- TypeScript

---

## Installation

```bash
git clone <repo-url>
cd <project-name>
pnpm install
```

---

## Executing

Create a `.env` file:

```env
DB_FILE_NAME=file:local.db
```

Run the database migrations:

```bash
pnpm db:migrate
```

Run the database seed:

```bash
pnpm db:seed
```

Then start the server:

```bash
pnpm dev
```
