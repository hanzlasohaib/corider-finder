import { useState } from "react";
import { searchRides, joinRide } from "../api/rideService";
import RideCard from "../components/RideCard";
import Button from "../components/Button";

function FindRidePage() {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rides, setRides] = useState([]);

  const handleSearch = async () => {
    try {
      const data = await searchRides(from, to); 
      setRides(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch rides");
    }
  };

  const handleJoin = async (rideId) => {
    try {
      await joinRide(rideId);
      alert("Joined ride");
    } catch (err) {
      console.error(err);
      alert("Failed to join ride");
    }
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">Find Ride</h2>

      <div className="flex gap-4">

        <input
          placeholder="From"
          value={from} 
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded p-2"
        />

        <input
          placeholder="To"
          value={to} 
          onChange={(e) => setTo(e.target.value)}
          className="border rounded p-2"
        />

        <Button onClick={handleSearch}>
          Search
        </Button>

      </div>

      <div className="space-y-4">

        {rides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            onJoin={handleJoin}
          />
        ))}

      </div>

    </div>
  );
}

export default FindRidePage;