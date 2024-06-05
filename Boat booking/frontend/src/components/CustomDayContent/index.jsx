import { formatDate } from "../../utils/formatDate";

const CustomDayContent = (day, allBookings) => {
  const allBookingsStartDate = allBookings.value?.map((booking) =>
    formatDate(new Date(booking.startTime))
  );
  const dateHasBooking = allBookingsStartDate.includes(formatDate(day));
  return (
    <div className="w-full flex justify-center items-center">
      {dateHasBooking ? (
        <div className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-primary-600 dark:bg-primary-100" />
      ) : null}
      <span>{new Date(day).getDate()}</span>
    </div>
  );
};

export default CustomDayContent;
