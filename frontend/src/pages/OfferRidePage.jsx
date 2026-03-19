import { useState } from "react";
import toast from "react-hot-toast";
import { createRide } from "../api/rideService";
import Card from "../components/Card";
import Button from "../components/Button";

function OfferRidePage() {

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

    try {
      await createRide(form);
      toast.success("Ride created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ride");
    }
  };

  return (
    <Card title="Offer a Ride">

      <form onSubmit={handleSubmit} className="space-y-4">

      <div>
  <label htmlFor="pickup_location" className="block text-sm font-medium">
    From
  </label>
  <input
    id="pickup_location"
    name="pickup_location"
    autoComplete="on"
    placeholder="From"
    onChange={handleChange}
    className="w-full border rounded p-2"
  />
</div>

<div>
  <label htmlFor="destination" className="block text-sm font-medium">
    To
  </label>
  <input
    id="destination"
    name="destination"
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
    autoComplete="on"
    onChange={handleChange}
    className="w-full border rounded p-2"
  />
</div>

<div>
  <label htmlFor="available_seat" className="block text-sm font-medium">
    Seats
  </label>
  <input
    id="available_seat"
    type="number"
    name="available_seat"
    autoComplete="on"
    placeholder="Seats"
    onChange={handleChange}
    className="w-full border rounded p-2"
  />
</div>

<div>
  <label htmlFor="fare" className="block text-sm font-medium">
    Price
  </label>
  <input
    id="fare"
    type="number"
    name="fare"
    autoComplete="on"
    placeholder="Price"
    onChange={handleChange}
    className="w-full border rounded p-2"
  />
</div>

        <Button onClick={handleSubmit}>
          Create Ride
        </Button>

      </form>

    </Card>
  );
}

export default OfferRidePage;