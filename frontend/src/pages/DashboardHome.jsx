import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCreatedRides, getMyJoinedRides, searchRides } from "../api/rideService";
import RideCard from "../components/RideCard";
import Button from "../components/Button";

function DashboardHome() {
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [createdCount, setCreatedCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch user's rides
        const created = await getMyCreatedRides();
        const joined = await getMyJoinedRides();
        setCreatedCount(created.length);
        setJoinedCount(joined.length);

        // Fetch available rides (general search)
        const available = await searchRides("", "");
        setRides(available);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <p className="text-gray-600">
          Quick overview of your rides and available matches.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border rounded shadow text-center">
          <p className="text-gray-500">Created Rides</p>
          <p className="text-2xl font-bold">{createdCount}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow text-center">
          <p className="text-gray-500">Joined Rides</p>
          <p className="text-2xl font-bold">{joinedCount}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow text-center">
          <Button onClick={() => navigate("/dashboard/offer")}>Offer Ride</Button>
        </div>
        <div className="p-4 bg-white border rounded shadow text-center">
          <Button onClick={() => navigate("/dashboard/find")}>Find Ride</Button>
        </div>
      </div>

      {/* Available Rides */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Rides</h3>
        <div className="space-y-4">
          {rides.length === 0 ? (
            <p className="text-gray-500">No rides available at the moment.</p>
          ) : (
            rides.map((ride) => <RideCard key={ride.id} ride={ride} />)
          )}
        </div>
      </div>

    </div>
  );
}

export default DashboardHome;