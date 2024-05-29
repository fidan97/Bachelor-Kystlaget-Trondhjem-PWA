import React from "react";
import Button from "../Button";
import Typography from "../Typography";
import { RxCalendar, RxClock } from "react-icons/rx";
import { VscPlug } from "react-icons/vsc";
import { BiRadioCircle } from "react-icons/bi";
import { isDarkMode } from "../../store/darkMode";

const BookingDetailsPopup = ({ isPopup, bookingDetails }) => {
  const bookingDetailsList = [
    {
      icon: <RxCalendar />,
      title: "Date",
      info: `${new Date(
        bookingDetails.value?.startTime
      ).toDateString()}-${new Date(
        bookingDetails.value?.endTime
      ).toDateString()}`,
    },
    {
      icon: <RxClock />,
      title: "Time",
      info: `${new Date(
        bookingDetails.value?.startTime
      ).toLocaleTimeString()}-${new Date(
        bookingDetails.value?.endTime
      ).toLocaleTimeString()}`,
    },
    {
      icon: <VscPlug />,
      title: "Last charged at",
      info: new Date(bookingDetails.value?.chargingDone).toLocaleString(),
    },
    {
      icon: <BiRadioCircle />,
      title: "Status",
      info:
        bookingDetails?.value?.status === "P"
          ? "Planned"
          : bookingDetails?.value?.status === "C"
          ? "Charge"
          : bookingDetails?.value?.status === "O"
          ? "Opened key box"
          : bookingDetails?.value?.status === "D"
          ? "returned key"
          : bookingDetails?.value?.status,
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full backdrop-brightness-75 z-[15] items-center justify-center ${
        isPopup.value ? "flex " : "hidden"
      }`}
    >
      {/* close on outside click */}
      <div
        className="block w-full h-full"
        onClick={() => (isPopup.value = false)}
      />
      <div
        className={`absolute w-10/12  rounded-2xl transition-all p-6 max-w-sm ${
          isDarkMode.value ? " bg-primary-700" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <Typography
            size="body1/semi-bold"
            className="capitalize"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            Booking details
          </Typography>
          <Button
            type="button"
            variant="icon"
            onClick={() => (isPopup.value = false)}
            className="bg-primary-100 !p-1 !rounded-full hover:bg-danger-600 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          {bookingDetailsList.map((booking, index) => (
            <div
              className="border border-primary-800 p-2 rounded-lg"
              key={index}
            >
              <div
                className={`flex items-center gap-2  ${
                  isDarkMode.value ? "text-primary-100" : "text-primary-600"
                }`}
              >
                {booking.icon}
                <Typography variant={isDarkMode.value ? "darkModeOn" : ""}>
                  {booking.title}
                </Typography>
              </div>
              <Typography
                size="body1/bold"
                variant={isDarkMode.value ? "darkModeOn" : ""}
              >
                {booking?.info}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPopup;
