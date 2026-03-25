import { useState } from "react";
import toast from "react-hot-toast";
import { createRide } from "../api/rideService";
import { useRide } from "../context/RideContext";
import Card from "../components/Card";
import Button from "../components/Button";

function OfferRidePage() {

  const { hasActiveRide, refreshRideState } = useRide();
  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    departure_time: "",
    available_seats: "",
    price: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasActiveRide) {
      toast.error("You are already in an active ride");
      return;
    }

    try {
      await createRide(form);
      toast.success("Ride created successfully");

      // ✅ sync global state
      refreshRideState();
      // ✅ CLEAR FORM
      setForm({
        from_location: "",
        to_location: "",
        departure_time: "",
        available_seats: "",
        price: ""
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to create ride");
    }
  };

  return (
    <Card title="Offer a Ride">

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="from_location" className="block text-sm font-medium">
            From
          </label>
          <input
            id="from_location"
            name="from_location"
            value={form.from_location}
            autoComplete="on"
            placeholder="From"
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="to_location" className="block text-sm font-medium">
            To
          </label>
          <input
            id="to_location"
            name="to_location"
            value={form.to_location}
            autoComplete="on"
            placeholder="To"
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="departure_time" className="block text-sm font-medium">
            Departure Time
          </label>
          <input
            id="departure_time"
            type="datetime-local"
            name="departure_time"
            value={form.departure_time}
            autoComplete="on"
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="available_seats" className="block text-sm font-medium">
            Seats
          </label>
          <input
            id="available_seats"
            type="number"
            name="available_seats"
            value={form.available_seats}
            min="1"
            max="2"
            autoComplete="on"
            placeholder="Max 2 seats"
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={form.price}
            autoComplete="on"
            placeholder="Price"
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <Button type="submit" disabled={hasActiveRide}>
          {hasActiveRide ? "Already in Ride" : "Create Ride"}
        </Button>

      </form>

    </Card>
  );
}

export default OfferRidePage;