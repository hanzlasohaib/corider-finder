import { useEffect, useRef, useState } from "react";
import { geocodePlace, reverseGeocode } from "../api/mapService";
import RideMap from "./RideMap";

export default function OfferRouteMap({
  fromLocation,
  toLocation,
  onPickupResolved,
  onDropResolved,
}) {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [step, setStep] = useState("pickup");
  const [status, setStatus] = useState("");
  const skipFrom = useRef("");
  const skipTo = useRef("");

  useEffect(() => {
    const query = fromLocation.trim();
    if (!query || query === skipFrom.current) return;
    const timer = setTimeout(async () => {
      const found = await geocodePlace(query);
      if (found) setPickup({ ...found, id: "pickup", kind: "pickup" });
    }, 700);
    return () => clearTimeout(timer);
  }, [fromLocation]);

  useEffect(() => {
    const query = toLocation.trim();
    if (!query || query === skipTo.current) return;
    const timer = setTimeout(async () => {
      const found = await geocodePlace(query);
      if (found) setDrop({ ...found, id: "drop", kind: "drop" });
    }, 700);
    return () => clearTimeout(timer);
  }, [toLocation]);

  const handleClick = async (lat, lng) => {
    setStatus("Reading that point.");
    const found = await reverseGeocode(lat, lng);
    const place = found || {
      lat,
      lng,
      label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    };
    if (step === "pickup") {
      skipFrom.current = place.label;
      setPickup({ ...place, id: "pickup", kind: "pickup" });
      onPickupResolved(place.label);
      setStep("drop");
      setStatus("Pickup set. Click the destination next.");
      return;
    }
    skipTo.current = place.label;
    setDrop({ ...place, id: "drop", kind: "drop" });
    onDropResolved(place.label);
    setStep("pickup");
    setStatus("Route set. Click again to change pickup.");
  };

  const points = [pickup, drop].filter(Boolean);
  const route =
    pickup && drop
      ? [
          [pickup.lat, pickup.lng],
          [drop.lat, drop.lng],
        ]
      : null;

  return (
    <section className="space-y-2" aria-label="Route map">
      <RideMap
        points={points}
        route={route}
        onMapClick={handleClick}
        ariaLabel="Choose pickup and destination on the map"
        className="h-72 lg:h-[22rem]"
      />
      <p className="text-xs text-slate-500">
        {status ||
          (step === "pickup"
            ? "Click the map to set pickup, or type a place above."
            : "Click the map to set destination.")}
      </p>
    </section>
  );
}
