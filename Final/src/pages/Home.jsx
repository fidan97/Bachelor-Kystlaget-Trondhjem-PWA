import React, { useEffect, useRef } from "react";
import Menubar from "../components/Menubar";
import Topbar from "../components/Topbar";
import Button from "../components/Button";
import Bookings from "../components/Bookings";
import ReservationForm from "../components/ReservationForm";
import Popup from "../components/Popup";
import { HiOutlineCheck, HiOutlineKey } from "react-icons/hi";
import { useSignal } from "@preact/signals-react";
import { isDarkMode } from "../store/darkMode";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import user from "../api/user";
import { addBooking } from "../api/bookings/addBooking";
import { BiLoaderCircle } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Home = () => {
  const reservationPopup = useSignal(false);
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);
  const formRef = useRef(null);
  const currentUserBookings = useSignal([]);
  const selectedDate = useSignal(null);
  const successPopup = useSignal(false);
  const isKeyPopup = useSignal(false);
  const isCollectKey = useSignal(false);
  const keyToggle = useSignal(false);
  const loadingKey = useSignal(false);
  const { t } = useTranslation();

  const keyDeliverMode = useSignal(true);
  const keyReturnValue = JSON.parse(localStorage.getItem("keyReturnValue"));
  const keyReturnMode = useSignal(keyReturnValue ?? false);
  const counter = useSignal(10);

  // format date
  function formatDate(date = new Date()) {
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", {
      month: "2-digit",
    });
    const day = date.toLocaleString("default", { day: "2-digit" });

    return [year, month, day].join("-");
  }

  const handleSelectDate = (item) => {
    const date = formatDate(new Date(item));
    const time = new Date().toLocaleTimeString("default", { hour12: false });
    const actulaDateTime = date + "T" + time;
    // console.log(actulaDateTime);
    selectedDate.value = actulaDateTime;
    reservationPopup.value = true;
    // console.log(selectedDate.value);
  };

  const handleAddResevation = async (e) => {
    e.preventDefault();
    isLoading.value = true;
    errorMessage.value = null;
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { boatId, startTime, endTime } = formDataObj;

        // If start time and end time are equal, return with an error message
        if (new Date(endTime) - new Date(startTime) <= 0)
          throw Error("Please select different end time!");

        const response = await addBooking({
          boatID: boatId.toString(),
          startTime: startTime.toString(),
          endTime: endTime.toString(),
          status: "0",
          comment: "0",
          userID: user.data.value?.id,
          bookingID: "0",
          isOfficial: true,
        });
        // console.log(response);
        if (response.status === 401) {
          throw Error("Auth Token expired! Please re-login");
        }
        if (response.status === 400) {
          throw Error(
            "Please Check one of following error occurred: 1.) Bookings can only be made 0 days in advance 2.) Booking must be in a booking period. 3.) Check for Booking overlaps with another booking "
          );
        }

        successPopup.value = true;
        e.target.reset();
        reservationPopup.value = false;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
      selectedDate.value = null;
    }
  };

  // check collect key is available only before 10 min of bookings

  const upcomingBookings = currentUserBookings.value?.filter((item) => {
    const hours = new Date(item.startTime).getHours() - new Date().getHours();
    const minutes =
      new Date(item.startTime).getMinutes() - new Date().getMinutes();
    const totalMinutes = hours * 60 + minutes;
    // console.log(totalMinutes);
    return (
      new Date(item.startTime).toDateString() === new Date().toDateString() &&
      totalMinutes >= 10
    );
  });
  // console.log(upcomingBookings);
  // console.log(currentUserBookings.value);

  function startCountdown() {
    const interval = setInterval(() => {
      counter.value--;
      if (counter.value <= 0) {
        clearInterval(interval);
        loadingKey.value = false;
        isCollectKey.value = true;
        keyToggle.value = !keyToggle.value;
        if (!keyToggle.value) {
          keyReturnMode.value = true;
          localStorage.setItem(
            "keyReturnValue",
            JSON.stringify(keyReturnMode.value)
          );
        }
      }
    }, 1000);
  }

  useEffect(() => {
    if (keyToggle.value) {
      counter.value = 10;
      startCountdown();
    }
  }, [keyToggle.value]);

  // reset key value
  if (!upcomingBookings.length) {
    keyReturnMode.value = false;
    localStorage.removeItem("keyReturnValue");
  }

  return (
    <div
      className={`w-full sm:max-w-calc ml-auto bg-gradient-to-b ${
        isDarkMode.value
          ? "from-gray-800 to-slate-950"
          : "from-gray-300 to-slate-400"
      }   `}
    >
      <Menubar />
      <div className="w-full flex flex-col gap-8 p-8">
        <Topbar />

        <div
          className={`flex flex-col gap-4  rounded-lg p-4 ${
            isDarkMode.value ? "bg-primary-800" : "bg-primary-700"
          }`}
        >
          <Calendar
            className={`rounded-xl homeCalendar bg-transparent 
            `}
            onChange={(item) => handleSelectDate(item)}
            minDate={new Date()}
          />
          <div className="flex items-center flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              variant="secondary"
              className="gap-4 !p-2 !w-full"
              onClick={() => (reservationPopup.value = true)}
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              {t("Make a new reservation")}
            </Button>
            <Button
              type="button"
              variant="teritary"
              className="gap-4 !p-2 !w-full"
              onClick={() => (
                (isKeyPopup.value = true),
                (keyDeliverMode.value = !keyReturnMode.value)
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
                transform="matrix(0 1 1 0 0 0)"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25z"
                />
              </svg>
              {keyReturnMode.value
                ? t("Return your key")
                : t("Collect your key")}
            </Button>
          </div>
        </div>

        <Bookings currentUserBookings={currentUserBookings} />
      </div>

      {reservationPopup.value ? (
        <ReservationForm
          isPopup={reservationPopup}
          isLoading={isLoading}
          errorMessage={errorMessage}
          handlePopupAction={handleAddResevation}
          actionText="Book Now"
          formRef={formRef}
          selectedDate={selectedDate}
        />
      ) : null}

      <Popup
        icon={<HiOutlineCheck size={100} />}
        iconClassName={"bg-secondary-600 text-white"}
        isPopup={successPopup}
        handlePopupAction={() => window.location.reload()}
        actionText="Go To Your Booking"
        title={"Booking Confirmed"}
        subtitle={"Your booking have been confirmed successfully "}
      />
      {upcomingBookings?.length ? (
        !keyReturnMode.value ? (
          <Popup
            icon={<HiOutlineKey size={50} transform="matrix(0 1 1 0 0 0)" />}
            iconClassName={"bg-secondary-100 text-secondary-500 p-6"}
            isPopup={isKeyPopup}
            actionText="Open lock box"
            handlePopupAction={() => {
              isKeyPopup.value = false;
              loadingKey.value = true;
              startCountdown();
            }}
            title={"Collect Key"}
            subtitle={
              "Click on the button to open the lockbox. it might take ≈10seconds."
            }
          />
        ) : (
          <Popup
            icon={<HiOutlineKey size={50} transform="matrix(0 1 1 0 0 0)" />}
            iconClassName={"bg-secondary-100 text-secondary-500 p-6"}
            isPopup={isKeyPopup}
            handleSeconaryAction={() => {
              isKeyPopup.value = false;
              loadingKey.value = true;
              startCountdown();
            }}
            title={"Deliver key"}
            secondaryActionText={"Open lock box"}
            subtitle={
              "To return the key, please, click on the red button, and it will open the lockbox"
            }
          />
        )
      ) : (
        <Popup
          icon={<HiOutlineKey size={50} transform="matrix(0 1 1 0 0 0)" />}
          iconClassName={"bg-secondary-100 text-secondary-500 p-6"}
          isPopup={isKeyPopup}
          title={"You don’t have any access to the key yet"}
          subtitle={
            "Please make a booking first, or wait until your booking time has started"
          }
        />
      )}
      {/* loading 10 sec */}
      <Popup
        icon={
          <BiLoaderCircle
            size={80}
            className="animate-spin duration-500"
            style={{ animationDuration: "2s" }}
          />
        }
        iconClassName={"text-secondary-600 p-6"}
        isPopup={loadingKey}
        title={keyReturnMode.value ? "Return key" : "Collect Key"}
        subtitle={`Please wait your key will be available in  ${counter.value} seconds`}
      />
      <Popup
        icon={<HiOutlineKey size={50} transform="matrix(0 1 1 0 0 0)" />}
        iconClassName={"bg-secondary-100 text-secondary-500 p-6"}
        isPopup={isCollectKey}
        actionText={
          keyReturnMode.value && !keyDeliverMode.value
            ? "Return Key"
            : "Collect Key"
        }
        title={
          keyReturnMode.value && !keyDeliverMode.value
            ? "Return Key"
            : "Collect Key"
        }
        subtitle={`The lockbox is now open. you can ${
          keyReturnMode.value && !keyDeliverMode.value ? "return" : "collect"
        } your key`}
        toggleValue={keyToggle}
      />
    </div>
  );
};

export default Home;
