export const remainingTime = (date) => {
  const hours = new Date(date).getHours() - new Date().getHours();
  const minutes = new Date(date).getMinutes() - new Date().getMinutes();
  const totalMinutes = hours * 60 + minutes;
  // console.log(totalMinutes);
  return totalMinutes;
};
