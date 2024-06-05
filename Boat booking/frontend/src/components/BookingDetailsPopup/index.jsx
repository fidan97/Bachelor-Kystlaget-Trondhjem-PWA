import React, { useEffect } from "react";
import Button from "../Button";
import Typography from "../Typography";
import { RxCalendar, RxClock } from "react-icons/rx";
import { VscPlug } from "react-icons/vsc";
import { BiRadioCircle } from "react-icons/bi";
import { isDarkMode } from "../../store/darkMode";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineKey } from "react-icons/hi";
import { remainingTime } from "../../utils/remainingTime";
import { t } from "i18next";

const BookingDetailsPopup = ({ isPopup, bookingDetails, activeToggle }) => {
  const canReturnKey =
    JSON.parse(localStorage.getItem("canReturnKey")) || false;

  const bookingDetailsList = [
    {
      icon: <RxCalendar />,
      title: `${t("Date")}`,
      info: (
        <span className="capitalize">
          <span>
            {new Date(bookingDetails.value?.startTime).toDateString()}
          </span>
          {" - "}
          <span>{new Date(bookingDetails.value?.endTime).toDateString()}</span>
        </span>
      ),
    },
    {
      icon: <RxClock />,
      title: `${t("Time")}`,
      info: (
        <span className="uppercase">
          <span>
            {new Date(bookingDetails.value?.startTime).toLocaleTimeString()}
          </span>
          {" - "}
          <span>
            {new Date(bookingDetails.value?.endTime).toLocaleTimeString()}
          </span>
        </span>
      ),
    },
    {
      icon: <VscPlug />,
      title: `${t("Last charged at")}`,
      info: (
        <span className="capitalize">
          {new Date(bookingDetails.value?.chargingDone).toDateString()}
          {", "}
          <span className="uppercase">
            {new Date(bookingDetails.value?.chargingDone).toLocaleTimeString()}
          </span>
        </span>
      ),
    },
    {
      icon: <BiRadioCircle />,
      title: "Status",
      info:
        bookingDetails?.value?.status === "P" || "\u0000"
          ? "Planned"
          : bookingDetails?.value?.status === "C"
          ? `${t("Charge")}`
          : bookingDetails?.value?.status === "O"
          ? `${t("Opened key box")}`
          : bookingDetails?.value?.status === "D"
          ? `${t("returned key")}`
          : bookingDetails?.value?.status,
    },
    activeToggle === "myBookings"
      ? {
          icon: <HiOutlineKey />,
          title: "Key Status",
          info:
            remainingTime(bookingDetails.value?.startTime) >= 10 &&
            !canReturnKey
              ? "Available"
              : remainingTime(bookingDetails.value?.startTime) < 10 &&
                !canReturnKey
              ? "Not Collected"
              : canReturnKey
              ? "Collected"
              : "Not available yet",
        }
      : {},
  ];
  useEffect(() => {
    document.body.style.overflow = isPopup.value ? "hidden" : "auto";
  }, [isPopup.value]);
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
        className={`absolute w-10/12 rounded-2xl transition-all p-6 bg-container_light dark:bg-container_dark ${
          activeToggle !== "allBookings"
            ? "sm:max-w-sm"
            : "sm:max-w-6xl bg-primary_light dark:bg-primary_dark"
        }`}
      >
        <div className="flex items-center justify-between">
          <Typography
            size="body1/semi-bold"
            className={`capitalize ${
              activeToggle !== "allBookings" ? "visible" : "invisible"
            }`}
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {t("Booking details")}
          </Typography>

          <Button
            type="button"
            variant="icon"
            onClick={() => (isPopup.value = false)}
            title="Close"
            className="bg-primary-100 !p-1 !rounded-full hover:bg-teritary hover:text-white"
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
        {/* user details */}
        {activeToggle === "allBookings" ? (
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-20 h-20 border-2 rounded-full">
              <img
                src={"/images/placeholderUser.svg"}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <Typography
              size="h6/bold"
              variant={isDarkMode.value ? "darkModeOn" : ""}
            >
              {bookingDetails.value?.bookingOwner}
            </Typography>
            <div>
              <Typography
                variant={isDarkMode.value ? "darkModeOn" : ""}
                className="flex items-center gap-1"
              >
                <FiPhoneCall size="20px" />{" "}
                {bookingDetails.value?.bookingOwnerNumber}
              </Typography>
            </div>
            <div className="w-full flex justify-center p-4 pt-0 bg-container_light dark:bg-container_dark translate-y-6 rounded-t-lg ">
              <Typography
                size="body1/semi-bold"
                className="capitalize text-center text-white bg-primary-700 dark:bg-primary-500 w-fit p-2 px-4 ronded rounded-b-3xl"
              >
                {t("Booking details")}
              </Typography>
            </div>
          </div>
        ) : null}

        <div
          className={`grid grid-cols-1 grid-flow-row-dense sm:grid-cols-2 gap-4 my-4 ${
            activeToggle === "allBookings"
              ? "h-52 overflow-y-auto sm:h-auto bg-container_light dark:bg-container_dark p-4 rounded-lg"
              : ""
          }`}
        >
          {bookingDetailsList.map((booking, index) => (
            <div
              className={`border border-primary-500 p-2 rounded-lg ${
                activeToggle === "allBookings"
                  ? "bg-primary_light dark:bg-primary_dark border-none"
                  : ""
              } ${
                activeToggle === "myBookings" &&
                booking?.title?.includes("Key Status")
                  ? "sm:col-span-2 "
                  : activeToggle !== "myBookings"
                  ? "last-of-type:hidden"
                  : ""
              }`}
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
