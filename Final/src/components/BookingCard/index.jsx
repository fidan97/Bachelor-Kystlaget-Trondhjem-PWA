import React, { useEffect, useRef } from "react";
import Button from "../Button";
import Typography from "../Typography";
import { isDarkMode } from "../../store/darkMode";
import { VscPlug } from "react-icons/vsc";
import { PiBoat } from "react-icons/pi";
import { useSignal } from "@preact/signals-react";
import { searchBoat } from "../../api/boat/searchBoat";

const BookingCard = ({
  activeToggle,
  isDeletePopup,
  isEditPopup,
  info,
  hanldeBookingDetailsPopup,
  selectedBookingId,
}) => {
  const isLoading = useSignal(false);
  const boatDetails = useSignal([]);
  const batteryLevel = useSignal(null);
  const chargingTime = useSignal(null);
  const maxBookingLimit = useSignal(null);

  const getBoats = async () => {
    isLoading.value = true;
    try {
      const res = await searchBoat({ searchQuery: info?.boatName });
      boatDetails.value = res?.items;
      chargingTime.value = res?.items?.find(
        (boat) => boat?.name === info?.boatName
      )?.chargingTime;
      maxBookingLimit.value = res?.items?.find(
        (boat) => boat?.name === info?.boatName
      )?.maxBookingLimit;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    if (activeToggle === "myBookings") getBoats();
  }, []);

  // calculate battery state
  const getBatteryState = () => {
    let batteryState = 1;
    const hours =
      new Date(info?.endTime).getHours() - new Date(info?.startTime).getHours();
    const minutes =
      new Date(info?.endTime).getMinutes() -
      new Date(info?.startTime).getMinutes();

    const bookingHours = hours + minutes / 60;
    const dischargeRate = bookingHours / maxBookingLimit.value;
    const rechargeRate = chargingTime.value / 4;
    // console.log({ dischargeRate, rechargeRate });
    batteryState = batteryState - dischargeRate + rechargeRate;
    // console.log({ batteryState });
    // Ensure the battery state does not exceed 100% or drop below 0%
    batteryState = Math.min(Math.max(batteryState, 0), 1);
    batteryState = Math.round(batteryState * 100);
    return batteryState;
  };

  useEffect(() => {
    if (
      activeToggle === "myBookings" &&
      chargingTime.value &&
      maxBookingLimit.value
    ) {
      const batteryState = getBatteryState();
      batteryLevel.value = batteryState;
    }
  }, [chargingTime.value, maxBookingLimit.value]);

  return (
    <div
      className={`${
        isDarkMode.value ? "bg-primary-800" : "bg-primary-100"
      } flex flex-col gap-4 rounded-lg p-4 min-w-fit m-4 `}
    >
      <div className="flex  gap-4 items-center">
        <Button
          type="button"
          variant="icon"
          className={`${
            activeToggle !== "allBookings" ? "bg-secondary-400 text-white" : ""
          }`}
        >
          {activeToggle === "allBookings" ? (
            <img
              src={"/images/placeholderImg.svg"}
              alt="user"
              className={`w-10 h-10 border p-1 border-primary-900 rounded-full ${
                isDarkMode.value ? "bg-primary-100" : ""
              }`}
            />
          ) : activeToggle === "bookingHistory" ? (
            <PiBoat size={25} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          )}
        </Button>
        <Typography
          size="h6/semi-bold"
          variant={isDarkMode.value ? "darkModeOn" : ""}
        >
          {activeToggle !== "allBookings"
            ? info?.boatName
              ? info?.boatName
              : "N/A"
            : info?.bookingOwner}
        </Typography>
      </div>
      <div
        className="flex flex-col gap-4"
        onClick={() => hanldeBookingDetailsPopup(info)}
      >
        <div className="border-t border-b p-2">
          <div className="flex items-center gap-4">
            <div
              className={`${
                isDarkMode.value ? "text-primary-100" : "text-primary-600"
              } flex flex-wrap gap-2 items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-secondray stroke-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <Typography variant={isDarkMode.value ? "darkModeOn" : ""}>
                {new Date(info.startTime).toLocaleTimeString()} -{" "}
                {new Date(info.endTime).toLocaleTimeString()}
              </Typography>
            </div>
            <div
              className={`${
                isDarkMode.value ? "text-primary-100" : "text-primary-600"
              } flex flex-wrap gap-2 items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-secondray stroke-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
              <Typography variant={isDarkMode.value ? "darkModeOn" : ""}>
                {new Date(info.startTime).toLocaleDateString()} -{" "}
                {new Date(info.endTime).toLocaleDateString()}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      {activeToggle === "myBookings" ? (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="icon"
              className="bg-primary-600 !rounded-full text-white"
              onClick={() => {
                (isEditPopup.value = true),
                  (selectedBookingId.value = info.bookingID);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </Button>
            <Button
              type="button"
              variant="icon"
              className="bg-teritary-600 !rounded-full text-white"
              onClick={() => {
                (isDeletePopup.value = true),
                  (selectedBookingId.value = info.bookingID);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </Button>
          </div>
          <Button
            type="button"
            variant="icon"
            className="bg-gray-50 rounded-full text-primary-500"
          >
            <VscPlug size={20} />
            {isLoading.value ? "--" : `${batteryLevel.value}%`}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default BookingCard;
