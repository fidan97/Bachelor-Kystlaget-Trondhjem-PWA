import { authToken } from "../../store/authToken";

export const getUserBookings = async ({ userId }) => {
  const response = await fetch(`/api/Bookings/${userId}/hasBooked`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
  });
  return response;
};
