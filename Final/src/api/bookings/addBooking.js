import { authToken } from "../../store/authToken";

export const addBooking = async ({
  bookingID,
  startTime,
  endTime,
  status,
  comment,
  userID,
  boatID,
  isOfficial,
}) => {
  const response = await fetch(`api/Bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
    body: JSON.stringify({
      bookingID,
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
