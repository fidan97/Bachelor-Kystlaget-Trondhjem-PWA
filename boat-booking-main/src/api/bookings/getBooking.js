import { authToken } from "../../store/authToken";

export const getBooking = async ({ bookingId }) => {
  const response = await fetch(`/api/Bookings/${bookingId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
