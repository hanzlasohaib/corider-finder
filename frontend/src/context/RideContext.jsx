import { createContext, useContext, useEffect, useState } from "react";
import { getMyCreatedRides, getMyJoinedRides } from "../api/rideService";
import { useAuth } from "./AuthContext";

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [hasActiveRide, setHasActiveRide] = useState(false);
  const [joinedRideIds, setJoinedRideIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshRideState = async () => {
    try {
      const created = await getMyCreatedRides();
      const joined = await getMyJoinedRides();

      setJoinedRideIds(joined.map((j) => j.ride.id));

      const hasActive =
        created.some((r) => r.status === "active") ||
        joined.some((j) => j.ride.status === "active");

      setHasActiveRide(hasActive);
    } catch (err) {
      console.error("RideContext error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setHasActiveRide(false);
      setJoinedRideIds([]);
      setLoading(false);
      return;
    }

    refreshRideState();
  }, [isAuthenticated]);

  return (
    <RideContext.Provider
      value={{
        hasActiveRide,
        joinedRideIds,
        setJoinedRideIds,
        setHasActiveRide,
        refreshRideState,
        loading,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => useContext(RideContext);
