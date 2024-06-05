import { authToken } from "../../store/authToken";

export const listBookingByBoatId = async ({ boatId }) => {
  const response = await fetch(`/api/Bookings/${boatId}/span`, {
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
