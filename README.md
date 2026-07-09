# Weekly Report Generator

This project is a MERN-style application:
- **Frontend**: React + Vite (`/frontend`)
- **Backend**: Node.js + Express + Mongoose (`/backend`)
- **Database**: MongoDB

Follow the steps below in order: dependencies → database → backend → frontend.

---

## 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or later (includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) (local install) **or** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- Git

---

## 2. Clone the Repository

```bash
git clone https://github.com/ChavidiIllankoon/Weekly-Report-Generator.git
cd Weekly-Report-Generator
```

---

## 3. Installing Dependencies

Dependencies must be installed separately for the backend and frontend.

### Backend dependencies
```bash
cd backend
npm install
```

### Frontend dependencies
```bash
cd ../frontend
npm install
```

---

## 4. Running the Database (MongoDB)

The backend expects a MongoDB connection string in a `MONGO_URI` environment variable.

### Option A: Local MongoDB
1. Install MongoDB Community Server and start the service:
   ```bash
   # macOS (Homebrew)
   brew services start mongodb-community

   # Linux (systemd)
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```
2. Your local connection string will look like:
   ```
   mongodb://localhost:27017/weekly-report-generator
   ```

### Option B: MongoDB Atlas (cloud)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string from **Connect → Drivers**, e.g.:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/weekly-report-generator
   ```

### Configure environment variables
Create a `.env` file inside the `backend/` folder:

```bash
cd backend
touch .env
```

Add the following to `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

# Optional: enables the AI-assisted report feature (/api/ai)
GROQ_API_KEY=your_groq_api_key
# or
OPENAI_API_KEY=your_openai_api_key
```

> `MONGO_URI` and `JWT_SECRET` are required — the server will not start/authenticate without them.
> The AI keys are optional; only needed if you want to use the AI report-assistance feature.

### (Optional) Seed the database with sample data
From the `backend/` folder:
```bash
npm run seed
```
This clears existing data and creates sample projects and two test users:
- **Member** — `member@test.com` / `password123`
- **Manager** — `manager@test.com` / `password123`

---

## 5. Running the Backend

From the `backend/` folder:

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# Or production mode
npm start
```

The API will start on `http://localhost:5000` (or whatever `PORT` you set).

Verify it's running:
```bash
curl http://localhost:5000/api/health
```
You should see:
```json
{ "status": "ok", "timestamp": "..." }
```

---

## 6. Running the Frontend

From the `frontend/` folder:

```bash
npm run dev
```

Vite will start the dev server, typically at `http://localhost:5173`.

> The frontend is pre-configured to call the API at `http://localhost:5000/api` (see `frontend/src/services/api.js`). Make sure the backend is running on port 5000, or update that file if you changed `PORT`.

To build a production bundle instead:
```bash
npm run build
npm run preview
```

---

## 7. Quick Start Summary

```bash
# Terminal 1 — Database (if running MongoDB locally)
mongod

# Terminal 2 — Backend
cd backend
npm install
npm run dev

# Terminal 3 — Frontend
cd frontend
npm install
npm run dev
```

Then open the frontend URL printed in Terminal 3 (usually `http://localhost:5173`) in your browser.
