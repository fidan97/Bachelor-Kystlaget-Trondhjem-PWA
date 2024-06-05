export const currentWeatherApi = async () => {
  const response = await fetch(`/locations/1-211102/forecast/currenthour`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
