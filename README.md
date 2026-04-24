# 🚗 CoRide Finder

A full-stack ride-sharing web application where users can **offer rides, find rides, and join rides in real-time**.

Built using a modern, scalable tech stack: **React + FastAPI + PostgreSQL**.

---

## ✨ Features

### 👤 Authentication

* User registration & login
* JWT-based authentication
* Protected routes

### 🚘 Ride Management

* Offer a ride
* Search available rides
* Join a ride
* View created rides
* View joined rides

### ⚡ Real-Time UX

* Instant UI updates after joining rides
* Global ride state synchronization
* No page refresh required

### 🎨 UI/UX

* Clean dashboard layout
* Fully responsive design
* Toast notifications
* Loading & empty states

---

## 🛠️ Tech Stack

### 🎯 Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios
* React Hot Toast
* Context API

### ⚙️ Backend

* FastAPI
* PostgreSQL
* SQLAlchemy
* Pydantic
* JWT Authentication

---

## 📁 Project Structure

```
coride-finder/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── core/
│   │   ├── services/
│   │   │── main.py
│   └── requirements.txt
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/coride-finder.git
cd coride-finder
```

---

## 🔧 Backend Setup (FastAPI)

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv .venv
```

### 3. Activate virtual environment

**Windows:**

```bash
.venv\Scripts\activate
```

**Mac/Linux:**

```bash
source .venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/coride_finder
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 6. Run backend server

```bash
python -m uvicorn app.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

## 💻 Frontend Setup (React)

### 1. Navigate to frontend

```bash
cd ../frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 4. Run frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔗 API Endpoints (Sample)

### 🔐 Auth

* `POST /api/v1/auth/register`
* `POST /api/v1/auth/login`

### 👤 Users

* `GET /api/v1/users/me`

### 🚘 Rides

* `POST /api/v1/rides/offer`
* `GET /api/v1/rides/search`
* `POST /api/v1/rides/{id}/join`
* `GET /api/v1/rides/user/created`

---

## 🧠 Architecture Highlights

* Clean separation of frontend & backend
* Context API for global state management
* RESTful API design
* JWT-based authentication
* Optimistic UI updates for enhanced user experience

---

## 🚀 Future Improvements

* 📍 Google Maps integration
* 💬 In-app chat between riders
* 🔔 Notifications system
* ⭐ Ratings & reviews
* 📱 Mobile app (React Native)
* 🌐 Deployment (Docker + CI/CD)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a pull request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Hanzla Sohaib**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
