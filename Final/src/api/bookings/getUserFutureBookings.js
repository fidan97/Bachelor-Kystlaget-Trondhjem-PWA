import { authToken } from "../../store/authToken";

export const getUserFutureBookings = async ({ userId }) => {
  const response = await fetch(`/api/Bookings/${userId}/futureBookings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
  });
  return response;
};
