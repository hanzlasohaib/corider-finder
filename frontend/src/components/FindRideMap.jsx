import { useEffect, useMemo, useState } from "react";
import { geocodePlace } from "../api/mapService";
import RideMap from "./RideMap";

export default function FindRideMap({ rides, onSelectRide }) {
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("idle");

  const pickupKeys = useMemo(() => {
    const seen = new Map();
    rides.forEach((ride) => {
      const key = ride.pickup_location.trim().toLowerCase();
      if (!key || seen.has(key)) return;
      seen.set(key, ride);
    });
    return [...seen.values()];
  }, [rides]);

  const pickupSignature = pickupKeys.map((ride) => ride.id).join(",");

  useEffect(() => {
    let cancelled = false;

    async function locate() {
      if (!pickupKeys.length) {
        setPlaces([]);
        setStatus("idle");
        return;
      }
      setStatus("loading");
      const next = [];
      for (const ride of pickupKeys) {
        const found = await geocodePlace(ride.pickup_location);
        if (cancelled) return;
        if (found) {
          next.push({
            id: ride.id,
            lat: found.lat,
            lng: found.lng,
            kind: "pickup",
            label: `${ride.pickup_location} to ${ride.destination}`,
          });
          setPlaces([...next]);
        }
      }
      if (!cancelled) setStatus(next.length ? "ready" : "empty");
    }

    locate();
    return () => {
      cancelled = true;
    };
    // pickupKeys is derived from pickupSignature
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupSignature]);

  const points = places.map((place) => ({
    ...place,
    onSelect: onSelectRide ? () => onSelectRide(place.id) : undefined,
  }));

  return (
    <section className="space-y-2" aria-label="Map of open pickups">
      <RideMap points={points} ariaLabel="Open ride pickups" className="h-72 lg:h-[22rem]" />
      <p className="text-xs text-slate-500">
        {status === "loading"
          ? "Placing pickups on the map."
          : status === "empty"
            ? "Those place names did not match a map point in Pakistan."
            : "Tiles from OpenStreetMap. Pins are pickup points."}
      </p>
    </section>
  );
}
