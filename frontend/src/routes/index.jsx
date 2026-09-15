import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../components/Layout";

import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import DashboardHome from "../pages/DashboardHome";
import OfferRidePage from "../pages/OfferRidePage";
import FindRidePage from "../pages/FindRidePage";
import MyRidesPage from "../pages/MyRidesPage";
import ProfilePage from "../pages/ProfilePage";
import NotFound from "../pages/NotFound";

import ProtectedRoute, { GuestRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/login",
        element: (
          <GuestRoute>
            <AuthPage />
          </GuestRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <GuestRoute>
            <AuthPage />
          </GuestRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "offer", element: <OfferRidePage /> },
          { path: "find", element: <FindRidePage /> },
          { path: "myrides", element: <MyRidesPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
