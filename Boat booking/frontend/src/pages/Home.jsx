import { useEffect, useRef } from "react";
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
import { listBookings } from "../api/bookings/listBookings";
import { formatDate } from "../utils/formatDate";
import CustomDayContent from "../components/CustomDayContent";
import { remainingTime } from "../utils/remainingTime";

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
  const allBookings = useSignal([]);

  const keyDeliverMode = useSignal(true);
  const localReturnKeyValue = JSON.parse(localStorage.getItem("canReturnKey"));
  const canReturnKey = useSignal(localReturnKeyValue ?? false);
  const counter = useSignal(10);

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
          status: "P",
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
        if (response.status === 500) {
          throw Error("Internal Server Error");
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
    return (
      new Date(item.startTime).toDateString() === new Date().toDateString() &&
      remainingTime(item.startTime) >= 10
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
          canReturnKey.value = true;
          localStorage.setItem(
            "canReturnKey",
            JSON.stringify(canReturnKey.value)
          );
        }
      }
    }, 1000);
  }

  useEffect(() => {
    const prevMonthBtn = document.body.querySelector(".rdrPprevButton");
    prevMonthBtn.setAttribute("title", "Previous Month");

    const nextMonthBtn = document.body.querySelector(".rdrNextButton");
    nextMonthBtn.setAttribute("title", "Next Month");

    const monthSelect = document.querySelector(".rdrMonthPicker select");
    monthSelect.setAttribute("title", "Select Month");

    const yearSelect = document.querySelector(".rdrYearPicker select");
    yearSelect.setAttribute("title", "Select Year");
  }, []);

  useEffect(() => {
    if (keyToggle.value) {
      counter.value = 10;
      startCountdown();
    }
  }, [keyToggle.value]);

  // reset key value
  if (!upcomingBookings.length) {
    canReturnKey.value = false;
    localStorage.removeItem("canReturnKey");
  }

  // get all bookings list
  const getAllBookings = async () => {
    errorMessage.value = null;
    try {
      const response = await listBookings();
      if (response.status === 401) {
        throw Error("Auth Token expired! Please re-login");
      }
      // console.log(res);
      const data = await response.json();
      allBookings.value = data;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return (
    <div className={`w-full sm:max-w-calc ml-auto`}>
      <Menubar />
      <div className="w-full flex flex-col gap-8 p-8">
        <Topbar />

        <div
          className={`flex flex-col gap-4 shadow rounded-lg p-4 bg-container_light dark:bg-container_dark`}
        >
          <Calendar
            className="rounded-xl homeCalendar bg-transparent"
            onChange={(item) => handleSelectDate(item)}
            minDate={new Date()}
            dayContentRenderer={(day) => CustomDayContent(day, allBookings)}
          />
          <div className="flex items-center flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              variant="secondary"
              className="gap-4 !p-2 !w-full"
              onClick={() => (reservationPopup.value = true)}
              aria-label="Make a new reservation"
              title="Make a new reservation"
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
                (keyDeliverMode.value = !canReturnKey.value)
              )}
              aria-label="Collect your key"
              title="Collect your key"
            >
              <HiOutlineKey size={25} transform="matrix(0 1 1 0 0 0)" />
              {canReturnKey.value
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
          actionText={t("Book Now")}
          formRef={formRef}
          selectedDate={selectedDate}
          allBookings={allBookings}
        />
      ) : null}

      <Popup
        icon={<HiOutlineCheck size={100} />}
        iconClassName={"bg-secondary text-white"}
        isPopup={successPopup}
        handlePopupAction={() => window.location.reload()}
        actionText={t("Go To Your Booking")}
        title={t("Booking Confirmed")}
        subtitle={t("Your booking have been confirmed successfully")}
      />
      {upcomingBookings?.length ? (
        !canReturnKey.value ? (
          <Popup
            icon={<HiOutlineKey size={50} transform="matrix(0 1 1 0 0 0)" />}
            iconClassName={"bg-secondary text-primary-100 p-6"}
            isPopup={isKeyPopup}
            actionText={t("Open lock box")}
            handlePopupAction={() => {
              isKeyPopup.value = false;
              loadingKey.value = true;
              startCountdown();
            }}
            title={t("Collect Key")}
            subtitle={t(
              "Click on the button to open the lockbox. it might take ≈10seconds."
            )}
          />
        ) : (
          <Popup
            icon={<HiOutlineKey size={50} transform="matrix(0 1 1 0 0 0)" />}
            iconClassName={"bg-secondary text-primary-100 p-6"}
            isPopup={isKeyPopup}
            handleSeconaryAction={() => {
              isKeyPopup.value = false;
              loadingKey.value = true;
              startCountdown();
            }}
            title={"Deliver key"}
            secondaryActionText={t("Open lock box")}
            subtitle={t(
              "To return the key, please, click on the red button, and it will open the lockbox"
            )}
          />
        )
      ) : (
        <Popup
          icon={<HiOutlineKey size={50} transform="matrix(0 1 1 0 0 0)" />}
          iconClassName={"bg-secondary text-primary-100 p-6"}
          isPopup={isKeyPopup}
          title={t("You don’t have any access to the key yet")}
          subtitle={t(
            "Please make a booking first, or wait until your booking time has started"
          )}
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
        title={canReturnKey.value ? t("Return Key") : t("Collect Key")}
        subtitle={`${t("Please wait your key will be available in")}  ${
          counter.value
        } seconds`}
      />
      <Popup
        icon={<HiOutlineKey size={50} transform="matrix(0 1 1 0 0 0)" />}
        iconClassName={"bg-secondary text-primary-100 p-6"}
        isPopup={isCollectKey}
        actionText={
          canReturnKey.value && !keyDeliverMode.value
            ? t("Return Key")
            : t("Collect Key")
        }
        title={
          canReturnKey.value && !keyDeliverMode.value
            ? t("Return Key")
            : t("Collect Key")
        }
        subtitle={`The lockbox is now open. you can ${
          canReturnKey.value && !keyDeliverMode.value ? "return" : "collect"
        } your key`}
        toggleValue={keyToggle}
      />
    </div>
  );
};

export default Home;
