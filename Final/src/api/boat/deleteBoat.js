import { authToken } from "../../store/authToken";

export const deleteBoat = async ({ boatId }) => {
  const response = await fetch(`/api/Boats/${boatId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.value}`,
    },
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
