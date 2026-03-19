import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../components/Layout";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import DashboardHome from "../pages/DashboardHome";
import OfferRidePage from "../pages/OfferRidePage";
import FindRidePage from "../pages/FindRidePage";
import MyRidesPage from "../pages/MyRidesPage";
import ProfilePage from "../pages/ProfilePage";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      { index: true, element: <HomePage /> },

      { path: "/login", element: <LoginPage /> },

      { path: "/register", element: <RegisterPage /> },

     
{
  path: "/dashboard",
  element: (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <DashboardHome />,
    },
    {
      path: "offer",
      element: <OfferRidePage />,
    },
    {
      path: "find",
      element: <FindRidePage />,
    },
    {
      path: "myrides",
      element: <MyRidesPage />,
    },
  ],
},

      {
        path: "/dashboard/offer",
        element: (
          <ProtectedRoute>
            <OfferRidePage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/dashboard/find",
        element: (
          <ProtectedRoute>
            <FindRidePage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/dashboard/myrides",
        element: (
          <ProtectedRoute>
            <MyRidesPage />
          </ProtectedRoute>
        ),
      },

{
  path: "/dashboard/profile",
  element: (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
},

      { path: "*", element: <NotFound /> },

    ],
  },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;