import { useState } from "react";
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
      alert("Ride created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create ride");
    }
  };

  return (
    <Card title="Offer a Ride">

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="from_location"
          placeholder="From"
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          name="to_location"
          placeholder="To"
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          type="datetime-local"
          name="departure_time"
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          type="number"
          name="available_seats"
          placeholder="Seats"
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <Button onClick={handleSubmit}>
          Create Ride
        </Button>

      </form>

    </Card>
  );
}

export default OfferRidePage;