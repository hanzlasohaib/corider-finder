import api from "./axios";

export const getCurrentUser = async () => {
  const res = await api.get("/v1/users/me");
  return res.data;
};