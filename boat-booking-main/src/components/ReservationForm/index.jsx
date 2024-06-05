import React, { useEffect } from "react";
import Typography from "../Typography";
import Input from "../Input";
import Button from "../Button";
import Select from "../Select";
import { useSignal } from "@preact/signals-react";
import { listBoat } from "../../api/boat/listBoat";
import { getBooking } from "../../api/bookings/getBooking";
import { isDarkMode } from "../../store/darkMode";
import { t } from "i18next";

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
  allBookings,
}) => {
  const boatList = useSignal([]);
  const bookingDetails = useSignal(null);

  const isViewAllBookings = useSignal(false);

  const bookingsOnSelectedDate =
    variant === "add"
      ? allBookings.value?.filter(
          (booking) =>
            new Date(booking.startTime).toDateString() ===
            new Date(selectedDate.value).toDateString()
        )
      : [];

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
      <div className="absolute w-10/12 rounded-2xl transition-all p-6 max-w-sm bg-container_light dark:bg-container_dark">
        <div className="flex items-center justify-between">
          <Typography
            size="body1/semi-bold"
            className="capitalize"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {!isViewAllBookings.value
              ? variant === "add"
                ? t("Make Reservation")
                : t("Update Bookings")
              : `Existing Bookings on ${new Date(
                  selectedDate.value
                ).toDateString()}`}
          </Typography>
          <Button
            type="button"
            variant="icon"
            title="close"
            onClick={() => (isPopup.value = false)}
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
        {variant === "edit" ? (
          <Typography
            size="body1/semi-bold"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {bookingDetails.value?.bookingOwner}
          </Typography>
        ) : null}

        {!isViewAllBookings.value ? (
          <form
            onSubmit={handlePopupAction}
            ref={formRef}
            className="flex flex-col gap-2  justify-center w-full my-1"
            required
          >
            <Select
              name="boatId"
              label={t("Choose a boat")}
              options={boatList.value?.map((boat) => {
                return {
                  label: boat.name,
                  value: boat.boatID,
                  image: "/images/boat.svg",
                };
              })}
              placeholder="Select boat"
            />
            <Typography
              size="body1/semi-bold"
              className="text-start"
              variant={isDarkMode.value ? "darkModeOn" : ""}
            >
              {t("Select Date And Time")}
            </Typography>
            {selectedDate?.value ? (
              <Typography
                size="small/normal"
                variant={isDarkMode.value ? "darkModeOn" : ""}
                className="flex items-center gap-1"
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
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
                {t("Please select your preferred booking time again")} !
              </Typography>
            ) : null}

            <div className="flex justify-between items-center gap-2 flex-col ">
              <Input
                name="startTime"
                label={t("Start time")}
                type="datetime-local"
                className="uppercase"
                required
                min={new Date().toISOString().slice(0, 16)}
                defaultValue={
                  variant === "add" && selectedDate.value
                    ? selectedDate.value.slice(0, 16)
                    : null
                }
                onChange={(e) => (selectedDate.value = e.target.value)}
              />

              <Input
                name="endTime"
                label={t("End time")}
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
              title={actionText}
              variant="secondary"
              className={`capitalize !rounded-xl !text-primary-600 bg-gradient-to-t from-lime-500 to-lime-200  ${
                actionText ? "flex" : "hidden"
              }`}
              disabled={isLoading.value}
            >
              {isLoading.value ? "loading..." : actionText}
            </Button>
            {errorMessage.value ? (
              <Typography
                variant="error"
                className="text-center my-2 dark:text-primary-100"
              >
                {errorMessage.value}
              </Typography>
            ) : null}
          </form>
        ) : (
          <div className="view-allbookings flex flex-col gap-2 my-2 w-full h-80 overflow-y-auto  dark:text-white">
            {bookingsOnSelectedDate?.length ? (
              bookingsOnSelectedDate?.map((booking, index) => (
                <div
                  className="flex gap-2 border-b last:border-b-0 p-2"
                  key={index}
                >
                  <span className="text-primary-600 dark:text-primary-50">
                    {index + 1}.
                  </span>
                  <div>
                    <Typography
                      size="body1/medium"
                      variant={isDarkMode.value ? "darkModeOn" : ""}
                      className="capitalize"
                    >
                      Booking Owner: {booking?.bookingOwner}
                    </Typography>
                    <Typography variant={isDarkMode.value ? "darkModeOn" : ""}>
                      Start Time:{" "}
                      <span className="capitalize">
                        {new Date(booking?.startTime).toDateString()}
                        {", "}
                        <span className="uppercase">
                          {new Date(booking?.startTime).toLocaleTimeString()}
                        </span>
                      </span>
                    </Typography>
                    <Typography variant={isDarkMode.value ? "darkModeOn" : ""}>
                      End Time:{" "}
                      <span className="capitalize">
                        {new Date(booking?.endTime).toDateString()}
                        {", "}
                        <span className="uppercase">
                          {new Date(booking?.endTime).toLocaleTimeString()}
                        </span>
                      </span>
                    </Typography>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant={isDarkMode.value ? "darkModeOn" : ""}>
                No booking found for this date
              </Typography>
            )}
          </div>
        )}
        {variant === "add" ? (
          selectedDate.value ? (
            <div className="flex justify-end items-center">
              <Button
                type="button"
                title={
                  !isViewAllBookings.value
                    ? "View All Bookings"
                    : "Hide bookings list"
                }
                onClick={() =>
                  (isViewAllBookings.value = !isViewAllBookings.value)
                }
                className="!rounded-xl !p-1.5 !px-2 !text-xs"
              >
                {!isViewAllBookings.value
                  ? "View All Bookings"
                  : "Hide bookings list"}
              </Button>
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
};

export default ReservationForm;
