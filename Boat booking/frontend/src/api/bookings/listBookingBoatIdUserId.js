import { authToken } from "../../store/authToken";

export const listBookingBoatIdUserId = async ({ BoatId, UserId }) => {
  const response = await fetch(`/api/Bookings/${BoatId}/byUser/${UserId}`, {
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
