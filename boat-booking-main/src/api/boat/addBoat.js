import { authToken } from "../../store/authToken";

export const addBoat = async ({
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
    method: "POST",
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
