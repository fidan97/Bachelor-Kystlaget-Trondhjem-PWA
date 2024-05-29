const apiKey = import.meta.env.VITE_PRIVATE_TIDE_KEY;

export const tideApi = async ({ lat, lng, startDate, endDate }) => {
  const res = await fetch(
    `/tide/extremes/point?lat=${lat}&lng=${lng}&start=${startDate}&end=${endDate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
    }
  );

  return res;
};
