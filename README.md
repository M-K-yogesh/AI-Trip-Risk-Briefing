# AI Outstation Trip Risk Briefing Generator

A production-ready full-stack AI application built for **Manivtha Tours & Travels** (Hyderabad). This system allows transport administrators to generate, track, and print AI-powered trip safety briefings for outstation drivers.

---

## Technical Stack

* **Frontend:** React.js (Vite), Tailwind CSS (Class-based dark/light theme, custom glassmorphism), Axios, React Router, Chart.js, jsPDF (client-side PDF generation), Lucide Icons.
* **Backend:** Node.js, Express.js REST API.
* **Database:** MySQL, Sequelize ORM.
* **AI Engine Options:** Choice of ChatGPT (OpenAI), Gemini (Google), and Pollination AI.
* **Security:** JWT authentication, bcrypt password hashing.

---

## Key Features

1. **Authentication System:** Secure registration and login for dispatch admins.
2. **AI Trip Briefing Generator:** Form inputs for Admin Name, Route, Season, Vehicle Type, Duration, and custom notes.
3. **AI Provider Dynamic Select:** Dropdown to switch between ChatGPT, Gemini, and Pollination AI.
4. **Low-Token Mode:** Restricts max output tokens (e.g. 400) and appends prompts to trigger ultra-concise, speed-optimized answers.
5. **Rate Limiting:** Protects models from API fatigue by restricting users to a database-backed **50 generations per day**.
6. **Voice-to-Text Input:** Microphone dictation next to trip factors utilizing browser Web Speech API.
7. **Document Export & Share:** Export reports to clean-printed PDF files (using jsPDF) or raw TXT sheets, copy output, or trigger Web Share API.
8. **Feedback loops:** 1-5 Star selector, Thumbs-Up/Down, and text review comments.
9. **Admin Analytics Dashboard:** Charts rendering daily dispatch counts, AI engine usage ratios, top routes, and average fleet ratings.
10. **Preloaded Presets:** Instant loading of classic outstation trip routes from Hyderabad (Bangalore, Goa, Mumbai, Chennai) with manual additions.

---

## Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org) (v18 or higher)
* [MySQL Server](https://www.mysql.com/downloads/) running locally or in the cloud.

### 1. Database Setup
Create a MySQL database named `outstation_trip_risk_db` using your MySQL shell or client:
```sql
CREATE DATABASE outstation_trip_risk_db;
```

### 2. Backend Installation (`/server`)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Set up the `.env` parameters:
   Copy `.env.example` to `.env` and fill in your keys:
   * Define your `MYSQL_USER` (defaults to `root`) and `MYSQL_PASSWORD`.
   * Configure AI Provider keys (e.g. `GROQ_API_KEY`, `GEMINI_API_KEY`).
   *(Note: Safe simulated mock responses are served if keys are left blank, making testing seamless out of the box).*

### 3. Frontend Installation (`/client`)
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install packages:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Verify your backend server URL exists in `client/.env`.

---

## Running the Application

### 1. Run Backend Server
From the `/server` directory:
```bash
npm run dev
```
The server will boot on `http://localhost:5000`. On startup, it automatically syncs Sequelize schemas to MySQL and seeds default outstation route presets.

### 2. Run React App
From the `/client` directory:
```bash
npm run dev
```
The Vite hot-reloading portal will start on `http://localhost:5173`. Open this URL in Google Chrome or Microsoft Edge (recommended for Web Speech / voice features).

---

## Directory Structure

```text
/server
├── /config/database.js   # Sequelize connection configuration
├── /controllers/         # REST Controllers (Auth, AI, Analytics, History, etc.)
├── /models/              # Sequelize Schemas (User, Generation, Feedback, Template)
├── /middlewares/auth.js  # JWT validation middleware
├── /routes/              # Express API Routes
├── /services/aiService.js# Multi-model integrations & fallback mock algorithms
└── server.js             # Express application starting point

/client
├── /src/components/      # Reusable React components (AIForm, OutputCard, Charts, etc.)
├── /src/context/         # State contexts (AuthContext, ThemeContext)
├── /src/pages/           # Application views (Dashboard, Login, Logs, Analytics)
├── /src/services/api.js  # Axios network caller
├── index.html
├── tailwind.config.js    # Tailwind styling config
└── postcss.config.js     # PostCSS loader config
```
