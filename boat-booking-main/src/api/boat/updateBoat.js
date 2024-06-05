import { authToken } from "../../store/authToken";

export const updateBoat = async ({
  boatId,
  name,
  chargingTime,
  weatherLimit,
  advanceBookingLimit,
  maxBookingLimit,
  lockBoxID,
  bookingsIds,
  bookingPeriodsIds,
}) => {
  const response = await fetch(`/api/Boats/${boatId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      chargingTime,
      weatherLimit,
      advanceBookingLimit,
      maxBookingLimit,
      lockBoxID,
      bookingsIds,
      bookingPeriodsIds,
    }),
  });
  const data = await response.json();
  return data;
};
