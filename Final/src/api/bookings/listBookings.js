import { authToken } from "../../store/authToken";

export const listBookings = async () => {
  const response = await fetch(`/api/Bookings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
  });

  return response;
};
