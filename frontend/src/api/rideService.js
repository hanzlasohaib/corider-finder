import api from "./axios";

// Create Ride
export const createRide = async (rideData) => {
  const payload = {
    pickup_location: rideData.from_location,
    destination: rideData.to_location,
    departure_time: rideData.departure_time + ":00",
    fare: Number(rideData.price),
    available_seat: Number(rideData.available_seats),
  };

  const res = await api.post("/v1/rides", payload);
  return res.data;
};

// Search rides (matches)
export const searchRides = async (pickup, destination) => {
  const res = await api.get("/v1/rides/matches", {
    params: {
      pickup,
      destination,
    },
  });
  return res.data;
};

// Join Ride
export const joinRide = async (rideId) => {
  const res = await api.post(`/v1/rides/${rideId}/join`);
  return res.data;
};

// My Created Rides
export const getMyCreatedRides = async () => {
  const res = await api.get("/v1/rides/user/created");
  return res.data;
};

// My Joined Rides
export const getMyJoinedRides = async () => {
  const res = await api.get("/v1/rides/user/joined");
  return res.data;
};

// Available Rides
export const getAvailableRides = async () => {
  const res = await api.get("/v1/rides");
  return res.data;
};

// Leave Ride
export const leaveRide = async (rideId) => {
  const res = await api.delete(`/v1/rides/${rideId}/leave`);
  return res.data;
};

// Cancel Ride
export const cancelRide = async (rideId) => {
  const res = await api.patch(`/v1/rides/${rideId}/cancel`);
  return res.data;
};

// Complete Ride
export const completeRide = async (rideId) => {
  const res = await api.post(`/v1/rides/${rideId}/complete`);
  return res.data;
};

// Delete Ride
export const deleteRide = async (rideId) => {
  const res = await api.delete(`/v1/rides/${rideId}`);
  return res.data;
};