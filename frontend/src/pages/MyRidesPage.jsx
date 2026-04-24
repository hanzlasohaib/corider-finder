import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Car, Users } from "lucide-react";
import {
  getMyCreatedRides,
  getMyJoinedRides,
  cancelRide,
  leaveRide,
  completeRide,
  deleteRide,
} from "../api/rideService";
import RideCard from "../components/RideCard";
import { useRide } from "../context/RideContext";
import EmptyState from "../components/EmptyState";
import { RideListSkeleton } from "../components/Skeleton";

function MyRidesPage() {
  const [createdRides, setCreatedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const { refreshRideState } = useRide();

  const handleLeave = async (rideId) => {
    try {
      await leaveRide(rideId);

      setJoinedRides((prev) => prev.filter((r) => r.ride.id !== rideId));

      await refreshRideState();

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

      await refreshRideState();

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

      await refreshRideState();

      toast.success("Ride completed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete ride");
    }
  };

  const handleDelete = async (rideId) => {
    try {
      await deleteRide(rideId);

      setCreatedRides((prev) => prev.filter((r) => r.id !== rideId));

      await refreshRideState();

      toast.success("Ride deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ride");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const created = await getMyCreatedRides();
        const joined = await getMyJoinedRides();

        setCreatedRides(created);
        setJoinedRides(joined);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your rides");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          My rides
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Rides you host and rides you have joined.
        </p>
      </div>

      <section aria-labelledby="created-heading" className="space-y-4">
        <h2
          id="created-heading"
          className="text-sm font-semibold uppercase tracking-wider text-slate-400"
        >
          Created rides
        </h2>

        {loading ? (
          <RideListSkeleton count={2} />
        ) : createdRides.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No rides you are hosting"
            description="When you offer a ride, it will show up here. Passengers can request to join from Find ride."
          />
        ) : (
          <div className="space-y-4">
            {createdRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="joined-heading" className="space-y-4">
        <h2
          id="joined-heading"
          className="text-sm font-semibold uppercase tracking-wider text-slate-400"
        >
          Joined rides
        </h2>

        {loading ? (
          <RideListSkeleton count={2} />
        ) : joinedRides.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No joined rides yet"
            description="Use Find ride to search routes and join a trip. Your upcoming and past joins will appear here."
          />
        ) : (
          <div className="space-y-4">
            {joinedRides.map((joined) => (
              <RideCard
                key={`${joined.id}-${joined.ride.id}`}
                ride={joined.ride}
                joinedAt={joined.joined_at}
                onLeave={handleLeave}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyRidesPage;
