import { authToken } from "../../store/authToken";

export const searchBoat = async ({ searchQuery }) => {
  const response = await fetch(`/api/Boats?search=${searchQuery}`, {
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
