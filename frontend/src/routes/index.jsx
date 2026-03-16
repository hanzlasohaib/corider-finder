import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../components/Layout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "../pages/DashboardPage";
import HomePage from '../pages/HomePage'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: '/dashboard', element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ), },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function Routes() {
  return <RouterProvider router={router} />
}

export default Routes
