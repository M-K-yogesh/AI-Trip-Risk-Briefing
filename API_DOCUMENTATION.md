# REST API Routes Documentation

All API endpoints are hosted relative to the backend server URL (e.g. `http://localhost:5000/api`). Protected routes require a valid JWT token sent in the headers as:
`Authorization: Bearer <JWT_TOKEN>`

---

## Authentication Routes

### 1. Register Account
* **Route:** `POST /auth/register`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "name": "Dispatch Admin Name",
    "email": "admin@manivtha.com",
    "password": "securepassword"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "message": "Registration successful.",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "name": "Dispatch Admin Name",
      "email": "admin@manivtha.com"
    }
  }
  ```

### 2. Login
* **Route:** `POST /auth/login`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "admin@manivtha.com",
    "password": "securepassword"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "Login successful.",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "name": "Dispatch Admin Name",
      "email": "admin@manivtha.com"
    }
  }
  ```

### 3. Verify Active Session
* **Route:** `GET /auth/me`
* **Auth Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "user": {
      "id": 1,
      "name": "Dispatch Admin Name",
      "email": "admin@manivtha.com",
      "createdAt": "2026-06-25T16:20:00.000Z"
    }
  }
  ```

---

## AI Generation Routes

### 1. Generate Safety Briefing
* **Route:** `POST /generate`
* **Auth Required:** Yes
* **Note:** Enforces a limit of **50 generations per user per day**.
* **Request Body:**
  ```json
  {
    "adminName": "Dispatch Admin Name",
    "routeFrom": "Hyderabad",
    "routeTo": "Bangalore",
    "season": "Monsoon",
    "vehicleType": "Volvo Multi-Axle",
    "duration": "9 Hours",
    "notes": "Drive carefully on the highway bypass road.",
    "selectedModel": "groq",
    "lowTokenMode": false
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "message": "Briefing generated successfully.",
    "generation": {
      "id": 12,
      "userId": 1,
      "adminName": "Dispatch Admin Name",
      "routeFrom": "Hyderabad",
      "routeTo": "Bangalore",
      "season": "Monsoon",
      "vehicleType": "Volvo Multi-Axle",
      "duration": "9 Hours",
      "notes": "Drive carefully on the highway bypass road.",
      "selectedModel": "Groq (Llama-3-70b)",
      "aiResponse": "# Weather Conditions...",
      "responseTimeMs": 1420,
      "createdAt": "2026-06-25T16:25:00.000Z"
    }
  }
  ```
* **Error Response (429 Too Many Requests):**
  ```json
  {
    "error": "Daily generation limit of 50 briefings reached for your account. Please try again tomorrow."
  }
  ```

---

## History Routes

### 1. Get User's Generation Logs
* **Route:** `GET /history`
* **Auth Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "history": [
      {
        "id": 12,
        "adminName": "Dispatch Admin Name",
        "routeFrom": "Hyderabad",
        "routeTo": "Bangalore",
        "season": "Monsoon",
        "vehicleType": "Volvo Multi-Axle",
        "duration": "9 Hours",
        "selectedModel": "Groq (Llama-3-70b)",
        "createdAt": "2026-06-25T16:25:00.000Z",
        "feedback": {
          "id": 5,
          "rating": 5,
          "liked": true,
          "comment": "Accurate weather description"
        }
      }
    ]
  }
  ```

### 2. Get Briefing By ID
* **Route:** `GET /history/:id`
* **Auth Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "generation": {
      "id": 12,
      "routeFrom": "Hyderabad",
      "routeTo": "Bangalore",
      "aiResponse": "# Weather Conditions...",
      "feedback": null
    }
  }
  ```

---

## Feedback Routes

### 1. Submit rating & comments
* **Route:** `POST /feedback`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "generationId": 12,
    "rating": 5,
    "liked": true,
    "comment": "Accurate weather description"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "message": "Feedback submitted successfully.",
    "feedback": {
      "id": 5,
      "generationId": 12,
      "rating": 5,
      "liked": true,
      "comment": "Accurate weather description"
    }
  }
  ```

---

## Analytics Routes

### 1. Compile Analytics statistics
* **Route:** `GET /analytics`
* **Auth Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "totalGenerations": 12,
    "avgRating": 4.6,
    "totalFeedback": 8,
    "totalLikes": 7,
    "avgResponseTimeMs": 1380,
    "routes": [
      { "route": "Hyderabad ➔ Bangalore", "count": 6 },
      { "route": "Hyderabad ➔ Goa", "count": 4 }
    ],
    "models": [
      { "model": "Groq (Llama-3-70b)", "count": 9 },
      { "model": "Gemini 1.5 Flash", "count": 3 }
    ],
    "dailyTrends": [
      { "date": "2026-06-24", "count": 5 },
      { "date": "2026-06-25", "count": 7 }
    ]
  }
  ```

---

## Template Routes

### 1. Get Preset Templates
* **Route:** `GET /templates`
* **Auth Required:** Yes
* **Success Response (200 OK):**
  ```json
  {
    "templates": [
      {
        "id": 1,
        "templateName": "Hyderabad ➔ Bangalore Express",
        "routeFrom": "Hyderabad",
        "routeTo": "Bangalore",
        "season": "Monsoon",
        "vehicleType": "Volvo AC Sleeper"
      }
    ]
  }
  ```

### 2. Create Preset Template
* **Route:** `POST /templates`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "templateName": "Hyderabad ➔ Pune Highway Route",
    "routeFrom": "Hyderabad",
    "routeTo": "Pune",
    "season": "Summer",
    "vehicleType": "Sedan Cab"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "message": "Template preset created successfully.",
    "template": {
      "id": 5,
      "templateName": "Hyderabad ➔ Pune Highway Route",
      "routeFrom": "Hyderabad",
      "routeTo": "Pune",
      "season": "Summer",
      "vehicleType": "Sedan Cab"
    }
  }
  ```
