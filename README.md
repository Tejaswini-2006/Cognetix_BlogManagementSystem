# Chronicle — Modern Blog Management System
### Cognetix Technology Full Stack Developer Internship — Task 4

[![Node.js](https://img.shields.io/badge/Node.js-v22.19.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21.2-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208.9.5-brightgreen.svg)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-purple.svg)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-orange.svg)](https://jwt.io/)

---

## 📖 Project Overview

**Chronicle** is a modern, responsive full-stack Blog Management System engineered for the **Cognetix Technology Full Stack Developer Internship (Task 4)**. 

The application provides a publication platform where technical writers and developers can register secure accounts, publish rich engineering articles, filter by dynamic categories, perform instant keyword searches, view estimated reading times, edit their publications with live side-by-side previews, and delete their articles with modal safety confirmation.

Security is enforced at every layer: passwords are salted and hashed using **bcryptjs**, API routes are guarded with signed **JSON Web Tokens (JWT)**, and resource mutations are strictly validated on the server to prevent Broken Object-Level Authorization (BOLA).

---

## 🚀 Key Features

### 1. Authentication & Security
- **Secure Registration & Login**: Validates full names, normalized emails, and minimum password lengths.
- **Cryptographic Password Hashing**: Passwords are salted and hashed with bcryptjs (10 salt rounds) before database persistence. Passwords are never returned in JSON responses or queries (`select: false` and `toJSON` stripping).
- **JWT Authorization**: Issues signed tokens with customizable expiry (`7d`).
- **Server-Enforced Authorization**: Edits and deletions are checked against the authenticated user's ID on the Express backend (`403 Forbidden` if not owner).
- **Duplicate Account Prevention**: Rejects already registered email addresses with HTTP `409 Conflict`.

### 2. Article Management & Reader Experience
- **Home / Blog Feed**: Displays published articles with author badges, publication dates, categories, excerpts, and calculated read times.
- **Search & Category Filter**: Real-time filtering across titles, excerpts, and content bodies with category chips.
- **Live Article Preview**: Interactive toggle between markdown writing mode and visual preview pane when creating or editing posts.
- **Author Dashboard (My Posts)**: Author portal displaying live publication analytics:
  - *Published Articles count*
  - *Total Words Written*
  - *Topics Covered*
- **Deletion Safety Modal**: Custom accessible dialog confirming post deletion before performing irreversible database removal.
- **Responsive Layout**: Designed with fluid CSS layouts, glassmorphism, gradient accents, modern typography (Google Fonts *Outfit* & *Plus Jakarta Sans*), and mobile navigation drawer.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Vite, Vanilla CSS3 (Custom Design System, Glassmorphism, CSS Tokens), Lucide React Icons |
| **Backend** | Node.js (v22), Express.js (v4.21), CORS, Dotenv |
| **Database** | MongoDB with Mongoose ODM (Indexes for search, schema validations, hooks) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Input sanitization & normalization |
| **Testing** | Node native fetch test runner, Browser Subagent automated end-to-end testing |

---

## 📂 Architecture and Directory Structure

```text
Cognetix_BlogManagementSystem/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Alert.jsx       # Dismissible notification banners
│   │   │   ├── DeleteModal.jsx # Deletion confirmation dialog
│   │   │   ├── Footer.jsx      # Application footer with metadata
│   │   │   ├── Navbar.jsx      # Navigation bar with responsive mobile menu
│   │   │   ├── PostCard.jsx    # Blog post preview card
│   │   │   └── ProtectedRoute.jsx # Route authentication guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state & session management
│   │   ├── pages/              # Application views
│   │   │   ├── CreatePost.jsx  # New article authoring with live preview
│   │   │   ├── EditPost.jsx    # Post editing for post owners
│   │   │   ├── Home.jsx        # Public feed, search, and category filter
│   │   │   ├── Login.jsx       # User login page
│   │   │   ├── MyPosts.jsx     # Author dashboard with statistics
│   │   │   ├── NotFound.jsx    # 404 handler
│   │   │   ├── PostDetail.jsx  # Single article reading view
│   │   │   └── Register.jsx    # User registration page
│   │   ├── services/
│   │   │   └── api.js          # Centralized API service with auth injection
│   │   ├── App.jsx             # React Router routing configuration
│   │   ├── index.css           # Design tokens, variables & glassmorphism
│   │   └── main.jsx            # React root mount
│   ├── .env.example            # Frontend environment variable template
│   ├── index.html              # HTML shell with Google Fonts & SEO tags
│   ├── package.json            # Client dependencies and build scripts
│   └── vite.config.js          # Vite config with /api reverse proxy
│
├── server/                     # Backend Application (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── authController.js   # Registration, login, profile retrieval
│   │   └── postController.js   # Full CRUD, search, filter, author posts
│   ├── middleware/
│   │   ├── auth.js             # JWT bearer verification middleware
│   │   └── errorHandler.js     # Centralized error handler (CastError, 11000)
│   ├── models/
│   │   ├── Post.js             # Mongoose Post model with text indexes
│   │   └── User.js             # Mongoose User model with bcrypt pre-save
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   └── postRoutes.js       # /api/posts endpoints
│   ├── tests/
│   │   └── api.test.js         # Comprehensive 21-point automated test suite
│   ├── utils/
│   │   └── seed.js             # Database seeding script for sample posts
│   ├── .env.example            # Backend environment variable template
│   ├── package.json            # Server dependencies and scripts
│   └── server.js               # Express application entrypoint
│
├── .gitignore                  # Git ignore rules for node_modules, .env, dist
├── package.json                # Root orchestration scripts
└── README.md                   # Full documentation
```

---

## ⚙️ Prerequisites

Before running the project locally, ensure you have:
1. **Node.js**: `v18.0.0` or higher (tested with `v22.19.0`)
2. **npm**: `v9.0.0` or higher (tested with `v10.9.3`)
3. **MongoDB**:
   - A local MongoDB instance running on `127.0.0.1:27017` **OR**
   - A free cloud database cluster from [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🔧 Installation & Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Tejaswini-2006/Cognetix_BlogManagementSystem.git
cd Cognetix_BlogManagementSystem
```

### 2. Configure Backend Environment
Navigate to the `server/` directory and create your `.env` file from `.env.example`:
```bash
cd server
cp .env.example .env
```

Configure the following variables in `server/.env`:
```env
# Server Port
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local MongoDB or Atlas URI)
MONGODB_URI=mongodb://127.0.0.1:27017/cognetix_blog

# JWT Configuration
JWT_SECRET=super_secret_cognetix_jwt_key_2026_dev
JWT_EXPIRE=7d

# Allowed Client Origin for CORS
CLIENT_URL=http://localhost:5173
```

> **Note on MongoDB Atlas Configuration**:
> If using MongoDB Atlas, replace `MONGODB_URI` with your connection string:
> `mongodb+srv://<db_username>:<db_password>@cluster0.mongodb.net/cognetix_blog?retryWrites=true&w=majority`

### 3. Configure Frontend Environment
Navigate to the `client/` directory and create your `.env` file from `.env.example`:
```bash
cd ../client
cp .env.example .env
```

Configure `client/.env`:
```env
# In development, the Vite server proxies /api to http://127.0.0.1:5000
VITE_API_URL=/api
```

### 4. Install Dependencies
You can install dependencies for both the server and client using the root script:
```bash
# From repository root:
npm run install:all
```
*Or install individually:*
```bash
cd server && npm install
cd ../client && npm install
```

### 5. Seed Initial Sample Data (Optional but Recommended)
Populate the database with a demo author account and high-quality engineering articles:
```bash
# From server directory:
node utils/seed.js

# Or from repository root:
npm run seed
```

**Demo Account Seeded:**
- **Email:** `author@cognetix.com`
- **Password:** `password123`

---

## 💻 Commands to Run the Application

### Option A: Run Server and Client Concurrently
Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
# Server listens on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Option B: Build for Production
To test the production build of the React client:
```bash
cd client
npm run build
npm run preview
```

---

## 📡 RESTful Backend API Documentation

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body | Response Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account | `{ name, email, password }` | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT | `{ email, password }` | `200 OK`, `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile | Header: `Bearer <token>` | `200 OK`, `401 Unauthorized` |

### Blog Post Endpoints (`/api/posts`)

| Method | Endpoint | Access | Description | Parameters / Body | Response Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | List articles with search & pagination | Query: `?page=1&limit=9&category=...&search=...` | `200 OK` |
| `GET` | `/api/posts/categories` | Public | List distinct categories | None | `200 OK` |
| `GET` | `/api/posts/mine` | Private | Get articles authored by logged-in user | Header: `Bearer <token>` | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/posts/:id` | Public | Get single article details | URL Param: `:id` | `200 OK`, `400 Invalid ID`, `404 Not Found` |
| `POST` | `/api/posts` | Private | Create a new blog post | `{ title, excerpt, content, category }` | `201 Created`, `400 Validation`, `401 Unauthorized` |
| `PUT` | `/api/posts/:id` | Private (Owner) | Update an owned blog post | `{ title?, excerpt?, content?, category? }` | `200 OK`, `400 Invalid ID`, `403 Forbidden`, `404 Not Found` |
| `DELETE` | `/api/posts/:id` | Private (Owner) | Permanently delete an owned post | Header: `Bearer <token>` | `200 OK`, `400 Invalid ID`, `403 Forbidden`, `404 Not Found` |
| `GET` | `/api/health` | Public | Healthcheck and server status | None | `200 OK` |

---

## 🧪 Testing and Verification Results

The project has been tested through automated API integration test suites and full-journey browser subagent automation:

### 1. Automated Backend API Test Suite (`node tests/api.test.js`)
All **21 automated tests passed**:
- `GET /api/health` returns 200 OK
- `POST /api/auth/register` registers new user and issues JWT
- `POST /api/auth/register` rejects duplicate email with 409 Conflict
- `POST /api/auth/register` creates second user for permission isolation
- `POST /api/auth/login` authenticates valid credentials
- `POST /api/auth/login` rejects invalid passwords with 401 Unauthorized
- `GET /api/auth/me` retrieves profile for valid JWT
- `GET /api/auth/me` rejects missing token with 401 Unauthorized
- `POST /api/posts` creates article with author relation
- `POST /api/posts` validates required fields and lengths (400 Bad Request)
- `GET /api/posts` returns paginated articles feed
- `GET /api/posts?search=...` queries title, excerpt, and body
- `GET /api/posts/:id` returns article details with populated author
- `GET /api/posts/mine` retrieves authenticated user's articles
- `GET /api/posts/mine` verifies isolation across distinct users
- `PUT /api/posts/:id` strictly prevents non-owners from editing with 403 Forbidden
- `PUT /api/posts/:id` allows verified owner to edit post
- `DELETE /api/posts/:id` strictly prevents non-owners from deleting with 403 Forbidden
- `DELETE /api/posts/:id` allows owner to delete post
- `GET /api/posts/:id` returns 404 for deleted posts
- `GET /api/posts/invalid-id` returns 400 Bad Request for malformed ObjectIDs

### 2. Browser End-to-End User Journeys
Automated browser subagent recorded full user flows:
- **Public Feed & Filters**: Loaded feed, toggled category chips (Technology, Web Development, Design), tested keyword search.
- **User Registration**: Successfully registered `Tejaswini Tester` with instant state update in navbar.
- **Article Authoring & Live Preview**: Composed article, checked live preview pane, and published.
- **Article Details & Sharing**: Rendered full article, calculated read time, tested link clipboard copy.
- **Article Editing**: Updated article title and verified instant reflection on the live page.
- **Author Dashboard**: Verified real-time metrics (Published Articles, Total Words, Topics Covered).
- **Deletion Safety Modal**: Verified warning dialog, executed deletion, and observed empty state.
- **Logout & Login**: Verified session clearing, re-authentication with demo credentials.
- **Responsive Mobile View**: Resized viewport to `375x667` mobile dimensions, tested hamburger menu navigation drawer.

---

## 🖼️ Application Preview & Screenshots

| View | Description |
| :--- | :--- |
| **Home Feed** | Modern hero banner, live search input, category chips, responsive cards with author avatars and read time. |
| **Article Details** | Full typography layout, publication date, author details, share link button, owner Edit & Delete buttons. |
| **Live Editor** | Split write/preview tabs, character counter, category selection with custom topic option. |
| **Author Dashboard** | Metric summary cards (Total Articles, Word Count, Topics Covered), search and filter within personal articles. |
| **Delete Modal** | Accessible glassmorphic confirmation modal with permanent deletion warning. |
| **Mobile Navigation** | Responsive layout with slide-out drawer menu on smaller viewports. |

---

## 🌐 Deployment Instructions

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write permissions.
3. Whitelist IP addresses (`0.0.0.0/0` for cloud deployment).
4. Copy the connection string into the backend environment variable `MONGODB_URI`.

### 2. Backend (Render / Railway / Heroku)
1. Deploy the `server/` directory as a Node.js web service.
2. Set build command: `npm install`.
3. Set start command: `node server.js`.
4. Configure environment variables in the host dashboard:
   - `PORT`: (Set automatically or `5000`)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<A strong, cryptographically generated random string>`
   - `CLIENT_URL`: `<Your deployed frontend URL (e.g., https://your-app.vercel.app)>`

### 3. Frontend (Vercel / Netlify)
1. Deploy the `client/` directory.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Set environment variable:
   - `VITE_API_URL`: `<Your deployed backend URL, e.g. https://your-api.onrender.com/api>`
6. For single-page app routing on Netlify/Vercel, ensure rewrite rules route all paths `/*` to `/index.html`.

---

## 📌 Repository Information

- **GitHub Repository**: [https://github.com/Tejaswini-2006/Cognetix_BlogManagementSystem](https://github.com/Tejaswini-2006/Cognetix_BlogManagementSystem)
- **Author**: Tejaswini-2006
- **Internship**: Cognetix Technology Full Stack Developer Internship — Task 4
- **License**: ISC
