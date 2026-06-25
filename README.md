# Luxury Woodwork Catalog

A full-stack catalog site for CNC woodwork — doors, drawers, wall panels, and decorative pieces. Built from the [Figma design](https://www.figma.com/design/3OWLVc9OE0miNHhbvkudIc/Luxury-Woodwork-Catalog) with a backend for hosting and managing catalog items.

## Features

- **Public catalog** — Beautiful landing page with filterable product grid
- **Admin panel** — Add, edit, and delete items; upload and replace photos; edit all text fields
- **Image uploads** — Store your own product photos (JPEG, PNG, WebP, GIF up to 10 MB)
- **SQLite database** — Lightweight, no external database required
- **Production ready** — Single server serves both API and built frontend

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set your admin password:

```bash
copy .env.example .env
```

Edit `.env` and set `ADMIN_PASSWORD` to a secure password.

### 3. Run in development

```bash
npm run dev
```

- **Catalog:** http://localhost:5173
- **Admin panel:** http://localhost:5173/admin
- **API:** http://localhost:3001/api

### 4. Build for production

```bash
npm run build
npm start
```

The server runs on port 3001 (or your `PORT` env var) and serves the catalog, admin panel, API, and uploaded images.

## Admin Panel

Go to `/admin` and sign in with your `ADMIN_PASSWORD`.

From the admin panel you can:

- **Add items** — Name, category, material, finish, dimensions, description, photo
- **Edit items** — Update any text field or replace the photo
- **Delete items** — Remove items from the catalog
- **Mark featured** — Highlight items with a "FEATURED" badge

## Hosting Options

### VPS / Railway / Render

1. Set environment variables: `ADMIN_PASSWORD`, `PORT`, `NODE_ENV=production`
2. Run `npm install && npm run build && npm start`
3. Ensure `data/` and `uploads/` directories persist (use volumes on cloud hosts)

### Docker (example)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "start"]
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | No | List all products |
| GET | `/api/products?category=Doors` | No | Filter by category |
| GET | `/api/products/:id` | No | Get single product |
| POST | `/api/products` | Yes | Create product |
| PUT | `/api/products/:id` | Yes | Update product |
| POST | `/api/products/:id/image` | Yes | Upload/replace photo |
| DELETE | `/api/products/:id` | Yes | Delete product |
| POST | `/api/auth/login` | No | Admin login |

## Project Structure

```
├── server/           # Express API + SQLite
│   ├── index.js      # Server entry point
│   ├── db.js         # Database & seed data
│   └── routes/       # API routes
├── src/              # React frontend
│   └── app/
│       ├── App.tsx   # Public catalog
│       ├── Admin.tsx # Admin panel
│       └── api.ts    # API client
├── data/             # SQLite database (auto-created)
└── uploads/          # Uploaded images (auto-created)
```

## Default Login

If you don't set `ADMIN_PASSWORD`, the default is `admin123`. **Change this before deploying to production.**
"# lakkisCatalog" 
