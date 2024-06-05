import { authToken } from "../../store/authToken";

export const listBoat = async () => {
  const response = await fetch(`/api/Boats`, {
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
