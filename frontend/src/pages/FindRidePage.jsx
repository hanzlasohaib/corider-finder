import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRide } from "../context/RideContext";
import { searchRides, joinRide } from "../api/rideService";
import RideCard from "../components/RideCard";
import Button from "../components/Button";

function FindRidePage() {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    hasActiveRide,
    joinedRideIds,
    refreshRideState
  } = useRide();

  // ✅ FIX 1: Refresh global state when page loads
  useEffect(() => {
    refreshRideState();
  }, []);

  const handleSearch = async () => {

    if (!from && !to) {
      toast.error("Enter at least one field");
      return;
    }

    try {
      setLoading(true);
      const data = await searchRides(from, to);
      setRides(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (rideId) => {
    if (hasActiveRide) {
      toast.error("You are already in an active ride");
      return;
    }

    try {
      await joinRide(rideId);
      toast.success("Joined ride");

      // ✅ FIX 2: Always sync from backend (NO manual state updates)
      await refreshRideState();

    } catch (err) {
      console.error(err);
      toast.error("Failed to join ride");
    }
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">Find Ride</h2>

      <div className="flex gap-4 items-end">

        {/* From */}
        <div className="flex flex-col">
          <label htmlFor="pickup" className="text-sm font-medium text-gray-700">
            From
          </label>
          <input
            id="pickup"
            name="pickup"
            autoComplete="on"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded p-2"
          />
        </div>

        {/* To */}
        <div className="flex flex-col">
          <label htmlFor="destination" className="text-sm font-medium text-gray-700">
            To
          </label>
          <input
            id="destination"
            name="destination"
            autoComplete="on"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded p-2"
          />
        </div>

        <Button onClick={handleSearch}>
          {loading ? "Searching..." : "Search"}
        </Button>

      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading rides...</p>
        ) : rides.length === 0 ? (
          <p className="text-gray-500">No rides found</p>
        ) : (
          rides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onJoin={handleJoin}
              isJoined={joinedRideIds.includes(ride.id)}
              hasActiveRide={hasActiveRide}
            />
          ))
        )}
      </div>

    </div>
  );
}

export default FindRidePage;