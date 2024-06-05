import { authToken } from "../../store/authToken";

export const deleteBooking = async ({ bookingId }) => {
  const response = await fetch(`/api/Bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
  });

  return response;
};
