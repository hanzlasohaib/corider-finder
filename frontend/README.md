# 🚗 CoRide Finder – Frontend

A modern ride-sharing web application built with **React (Vite)** and **Tailwind CSS**, allowing users to find, join, and manage rides seamlessly.

---

## ✨ Features

* 🔍 Search rides by pickup and destination
* 🚘 Join available rides
* 📋 View your created and joined rides
* ⚡ Real-time UI updates (no page refresh required)
* 🔐 Authentication-based access
* 🎯 Clean and responsive dashboard UI

---

## 🛠️ Tech Stack

* **React (Vite)**
* **Tailwind CSS**
* **React Router**
* **Axios**
* **React Hot Toast**
* **Context API**

---

## 📁 Project Structure

```
src/
│── api/          # API service functions
│── components/   # Reusable UI components
│── context/      # Global state (RideContext, Auth)
│── pages/        # App pages (Dashboard, FindRide, etc.)
│── layouts/      # Layouts (Sidebar, Navbar)
│── assets/       # Images / icons
│── App.jsx
│── main.jsx
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/coride-finder.git
cd coride-finder/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## 🔗 API Integration

This frontend connects to a **FastAPI backend**.

Ensure your backend is running at:

```
http://127.0.0.1:8000
```

---

## 🧠 State Management

Global state is handled using the **React Context API**:

* **RideContext**

  * Tracks active ride
  * Stores joined ride IDs
  * Syncs with backend

---

## 🎨 UI/UX Highlights

* Modern card-based design
* Fully responsive layout (mobile-friendly)
* Loading & empty states
* Toast notifications for user feedback
* Disabled states for improved UX

---

## 🚀 Future Improvements

* 🔔 Notifications system
* 💬 In-app chat between riders
* 📍 Maps integration (Google Maps)
* ⭐ Ratings & reviews
* 📱 Progressive Web App (PWA)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Hanzla Sohaib**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
