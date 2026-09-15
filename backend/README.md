# CoRide Finder Backend

Backend service for the **CoRide Finder** student ride-sharing application built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy**.

The backend provides APIs for user authentication, ride creation, ride matching, and joining rides.

---

# Tech Stack

* Python 3.11
* FastAPI
* PostgreSQL
* SQLAlchemy 2.x
* Pydantic / pydantic-settings
* python-dotenv

---

# Project Structure

```
backend/
  app/
    api/
      v1/
    core/
    db/
    models/
    schemas/
    services/
  main.py
```

---

# Features

* User registration and authentication
* JWT based login system
* Create ride offers
* Join existing rides
* Ride matching endpoint
* Cancel rides
* Pagination for ride listing

---

# API Documentation

Interactive API documentation is available via Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

# Database

Database: **PostgreSQL**

Tables can be created automatically in non-production environments on startup.

For production, run Alembic:

```
cd backend
alembic upgrade head
```

---

# Quick Start

## 1. Activate Virtual Environment

From project root:

```
.venv\Scripts\activate
```

---

## 2. Navigate to Backend Folder

```
cd backend
```

---

## 3. Install Dependencies

```
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/coride
SECRET_KEY=replace-with-a-long-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 5. Start the Development Server

Run the backend using Uvicorn:

```
python -m uvicorn app.main:app --reload
```

Server will start at:

```
http://127.0.0.1:8000
```

---

# Development Notes

* Tables can be created automatically when `ENV` is not `production`.
* Use `alembic upgrade head` to apply versioned schema changes.
* The API is versioned under `/api/v1`.
* All endpoints can be tested using Swagger UI.

Example endpoints:

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh

GET    /api/v1/rides
POST   /api/v1/rides
GET    /api/v1/rides/matches
GET    /api/v1/rides/{ride_id}
POST   /api/v1/rides/{ride_id}/join
PATCH  /api/v1/rides/{ride_id}/cancel
```

---

# Running the Server (Example)

```
PS D:\Projects\CoRider Finder> .venv\Scripts\activate
(.venv) PS D:\Projects\CoRider Finder> cd backend
(.venv) PS D:\Projects\CoRider Finder\backend> python -m uvicorn app.main:app --reload
```

---

# Future Improvements

* Alembic migrations are in `alembic/versions/`
* Add ride history endpoints
* Add user profile APIs
* Add request validation improvements
* Add Docker deployment

---

# License

This project is for learning and development purposes.
