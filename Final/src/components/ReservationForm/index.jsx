import React, { useEffect } from "react";
import Typography from "../Typography";
import Input from "../Input";
import Button from "../Button";
import Select from "../Select";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
import { useSignal } from "@preact/signals-react";
import { listBoat } from "../../api/boat/listBoat";
import { getBooking } from "../../api/bookings/getBooking";
import { isDarkMode } from "../../store/darkMode";

const ReservationForm = ({
  isPopup,
  isLoading,
  errorMessage,
  formRef,
  handlePopupAction,
  actionText,
  variant = "add",
  selectedBookingId,
  selectedDate,
}) => {
  const boatList = useSignal([]);
  const bookingDetails = useSignal(null);

  // get boat list
  const getBoats = async () => {
    try {
      const response = await listBoat();
      boatList.value = await response?.items;
    } catch (error) {
      console.log(error);
    }
  };

  // get booking details with booking id
  const getBookingDetails = async () => {
    if (!selectedBookingId.value) return;
    try {
      const response = await getBooking({ bookingId: selectedBookingId.value });
      bookingDetails.value = response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBoats();
    if (variant === "edit") {
      getBookingDetails();
    }
  }, []);

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
          isDarkMode.value ? "bg-primary-700" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <Typography
            size="body1/semi-bold"
            className="capitalize"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {variant === "add" ? "Make Reservation" : "Update Bookings"}
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
        {variant === "edit" ? (
          <Typography
            size="body1/semi-bold"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {bookingDetails.value?.bookingOwner}
          </Typography>
        ) : null}
        <form
          onSubmit={handlePopupAction}
          ref={formRef}
          className="flex flex-col gap-2  justify-center w-full my-1"
          required
        >
          <Select
            name="boatId"
            label={"Choose a boat"}
            options={boatList.value?.map((boat) => {
              return {
                label: boat.name,
                value: boat.boatID,
              };
            })}
          />
          <Typography
            size="body1/semi-bold"
            className="text-start"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            Select Date And Time
          </Typography>
          {selectedDate?.value ? (
            <Typography
              size="small/normal"
              variant={isDarkMode.value ? "darkModeOn" : "error"}
            >
              !! Please re-select your prefer booking time !!
            </Typography>
          ) : null}

          <div className="flex justify-between items-center gap-2 flex-col ">
            <Input
              name="startTime"
              label="Start time"
              type="datetime-local"
              className="uppercase"
              required
              min={new Date().toISOString().slice(0, 16)}
              defaultValue={
                variant === "add" && selectedDate.value
                  ? selectedDate.value.slice(0, 16)
                  : null
              }
            />

            <Input
              name="endTime"
              label="End time"
              type="datetime-local"
              className="uppercase "
              required
              min={new Date().toISOString().slice(0, 16)}
              defaultValue={
                variant === "add" && selectedDate.value
                  ? selectedDate.value.slice(0, 16)
                  : null
              }
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            className={`capitalize !rounded-xl !text-primary-600 bg-gradient-to-t from-lime-500 to-lime-200  ${
              actionText ? "flex" : "hidden"
            }`}
            disabled={isLoading.value}
          >
            {isLoading.value ? "loading..." : actionText}
          </Button>

          {errorMessage.value ? (
            <Typography variant="error" className="text-center mt-2">
              {errorMessage.value}
            </Typography>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
