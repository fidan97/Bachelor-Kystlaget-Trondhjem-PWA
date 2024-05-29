import { authToken } from "../../store/authToken";

export const listUsers = async () => {
  const response = await fetch(`/api/User`, {
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
