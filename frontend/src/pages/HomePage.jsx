import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="max-w-xl">

      <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-5">

        <h2 className="text-2xl font-semibold text-gray-800">
          Student Ride Sharing
        </h2>

        <p className="text-gray-600">
          CoRide Finder helps students share bike rides and split travel costs.
          Find rides with fellow students and make campus travel faster,
          safer, and more affordable.
        </p>

        <div className="flex gap-4 pt-2">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Create Account
          </Link>

          <Link
            to="/login"
            className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          >
            Login
          </Link>
        </div>

      </div>

    </div>
  );
}

export default HomePage;
