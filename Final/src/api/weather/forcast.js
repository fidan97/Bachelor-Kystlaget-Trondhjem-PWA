export const forcastWeatherApi = async () => {
  const response = await fetch(`/locations/1-211102/forecast`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
