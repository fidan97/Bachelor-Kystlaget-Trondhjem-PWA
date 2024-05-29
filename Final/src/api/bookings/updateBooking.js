import { authToken } from "../../store/authToken";

export const updateBooking = async ({
  bookingID,
  startTime,
  endTime,
  status,
  comment,
  userID,
  boatID,
  isOfficial,
}) => {
  const response = await fetch(`/api/Bookings/${bookingID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
    body: JSON.stringify({
      startTime,
      endTime,
      status,
      comment,
      userID,
      boatID,
      isOfficial,
    }),
  });
  return response;
};
