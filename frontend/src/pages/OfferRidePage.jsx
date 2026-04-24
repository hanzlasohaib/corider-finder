import { useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Clock, Users, Coins } from "lucide-react";
import { createRide } from "../api/rideService";
import { useRide } from "../context/RideContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { fieldWithIconClass } from "../lib/formClasses";

function OfferRidePage() {
  const { hasActiveRide, refreshRideState } = useRide();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    departure_time: "",
    available_seats: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasActiveRide) {
      toast.error("You are already in an active ride");
      return;
    }

    try {
      setSubmitting(true);
      await createRide(form);
      toast.success("Ride created successfully");

      refreshRideState();
      setForm({
        from_location: "",
        to_location: "",
        departure_time: "",
        available_seats: "",
        price: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ride");
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = "text-sm font-medium text-slate-700";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Offer a ride
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Share your route and fare — riders can find you from Find ride.
        </p>
      </div>

      <Card
        title="Trip details"
        subtitle="All fields are sent to the server as before."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="from_location" className={labelClass}>
                From
              </label>
              <div className="relative mt-1.5">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="from_location"
                  name="from_location"
                  value={form.from_location}
                  autoComplete="street-address"
                  placeholder="Pickup area"
                  onChange={handleChange}
                  className={fieldWithIconClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="to_location" className={labelClass}>
                To
              </label>
              <div className="relative mt-1.5">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500"
                  aria-hidden
                />
                <input
                  id="to_location"
                  name="to_location"
                  value={form.to_location}
                  autoComplete="street-address"
                  placeholder="Destination"
                  onChange={handleChange}
                  className={fieldWithIconClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="departure_time" className={labelClass}>
              Departure time
            </label>
            <div className="relative mt-1.5">
              <Clock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                id="departure_time"
                type="datetime-local"
                name="departure_time"
                value={form.departure_time}
                onChange={handleChange}
                className={fieldWithIconClass}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="available_seats" className={labelClass}>
                Seats
              </label>
              <div className="relative mt-1.5">
                <Users
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="available_seats"
                  type="number"
                  name="available_seats"
                  value={form.available_seats}
                  min="1"
                  max="2"
                  placeholder="Max 2 seats"
                  onChange={handleChange}
                  className={fieldWithIconClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className={labelClass}>
                Price (Rs / seat)
              </label>
              <div className="relative mt-1.5">
                <Coins
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600"
                  aria-hidden
                />
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={form.price}
                  placeholder="Fare per seat"
                  onChange={handleChange}
                  className={fieldWithIconClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={hasActiveRide || submitting}
              loading={submitting}
            >
              {hasActiveRide ? "Already in a ride" : "Publish ride"}
            </Button>
            {hasActiveRide && (
              <p className="text-sm text-amber-700">
                Finish or leave your current ride before hosting a new one.
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default OfferRidePage;
