export const sunUpDownTimeApi = async () => {
  const res = await fetch(`/locations/1-211102/celestialeventsmultipledays`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const sunUpDownData = await res.json();
  // find today info about sun rise
  const todayInfo = sunUpDownData?.days?.find(
    (item) => new Date(item.date).toDateString() === new Date().toDateString()
  )?.sun?.events;

  return todayInfo;
};
