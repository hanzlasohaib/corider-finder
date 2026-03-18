import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-5">

      <h2 className="text-2xl font-bold mb-8">
        Dashboard
      </h2>

      <nav className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Overview
        </Link>

        <Link
          to="/dashboard/offer"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Offer Ride
        </Link>

        <Link
          to="/dashboard/find"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Find Ride
        </Link>

        <Link
          to="/dashboard/myrides"
          className="hover:bg-gray-700 p-2 rounded"
        >
          My Rides
        </Link>

      </nav>
    </div>
  );
}