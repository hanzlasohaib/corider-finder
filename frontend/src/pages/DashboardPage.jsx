import { NavLink, Outlet } from "react-router-dom";

function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 space-y-6">

        <h2 className="text-xl font-semibold text-gray-800">
          CoRide
        </h2>

        <nav className="flex flex-col gap-2 text-sm">

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-gray-200 font-medium" : "text-gray-600"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/offer"
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-gray-200 font-medium" : "text-gray-600"
              }`
            }
          >
            Offer Ride
          </NavLink>

          <NavLink
            to="/dashboard/find"
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-gray-200 font-medium" : "text-gray-600"
              }`
            }
          >
            Find Ride
          </NavLink>

          <NavLink
            to="/dashboard/myrides"
            className={({ isActive }) =>
              `p-2 rounded ${
                isActive ? "bg-gray-200 font-medium" : "text-gray-600"
              }`
            }
          >
            My Rides
          </NavLink>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        <Outlet />

      </main>

    </div>
  );
}

export default DashboardPage;