import { useEffect, useState } from "react";
import { getMyCreatedRides, getMyJoinedRides } from "../api/rideService";
import RideCard from "../components/RideCard";

function MyRidesPage() {

  const [createdRides, setCreatedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);

  useEffect(() => {
    const load = async () => {
      const created = await getMyCreatedRides();
      const joined = await getMyJoinedRides();

      setCreatedRides(created);
      setJoinedRides(joined);
    };

    load();
  }, []);

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">My Rides</h2>

      {/* Created Rides */}
      <div>
        <h3 className="font-medium mb-2">Created Rides</h3>
        <div className="space-y-4">
          {createdRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      </div>

      {/* Joined Rides */}
      <div>
        <h3 className="font-medium mb-2">Joined Rides</h3>
        <div className="space-y-4">
        {joinedRides.map((joined) => (
          <RideCard key={joined.id} ride={joined.ride} joinedAt={joined.joined_at} />
))}
        </div>
      </div>

    </div>
  );
}

export default MyRidesPage;
