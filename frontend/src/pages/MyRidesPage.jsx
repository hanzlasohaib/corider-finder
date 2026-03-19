import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyCreatedRides, getMyJoinedRides } from "../api/rideService";
import RideCard from "../components/RideCard";

function MyRidesPage() {

  const [createdRides, setCreatedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);

  const handleLeave = async (rideId) => {
    try {
      await leaveRide(rideId);
  
      // remove from UI instantly (best UX)
      setJoinedRides((prev) =>
        prev.filter((r) => r.ride.id !== rideId)
      );
  
      toast.success("Left ride successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to leave ride");
    }
  };

  const handleCancel = async (rideId) => {
    try {
      await cancelRide(rideId);
  
      setCreatedRides((prev) =>
        prev.map((r) =>
          r.id === rideId ? { ...r, status: "cancelled" } : r
        )
      );
  
      toast.success("Ride cancelled");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel ride");
    }
  };
  
  const handleComplete = async (rideId) => {
    try {
      await completeRide(rideId);
  
      setCreatedRides((prev) =>
        prev.map((r) =>
          r.id === rideId ? { ...r, status: "completed" } : r
        )
      );
  
      toast.success("Ride completed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete ride");
    }
  };
  
  const handleDelete = async (rideId) => {
    try {
      await deleteRide(rideId);
  
      setCreatedRides((prev) =>
        prev.filter((r) => r.id !== rideId)
      );
  
      toast.success("Ride deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ride");
    }
  };

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
            <RideCard key={ride.id} ride={ride} 
            onCancel={handleCancel}
            onComplete={handleComplete}
            onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Joined Rides */}
      <div>
        <h3 className="font-medium mb-2">Joined Rides</h3>
        <div className="space-y-4">
        {joinedRides.map((joined) => (
          <RideCard key={`${joined.id}-${joined.ride.id}`} ride={joined.ride} joinedAt={joined.joined_at} onLeave={handleLeave} />
))}
        </div>
      </div>

    </div>
  );
}

export default MyRidesPage;
