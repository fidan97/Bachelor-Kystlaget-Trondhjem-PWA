import React, { useEffect, useRef } from "react";
import Button from "../Button";
import Typography from "../Typography";
import Slider from "react-slick";
import BookingCard from "../BookingCard";
import {
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineCheck,
  HiOutlineTrash,
} from "react-icons/hi";
import { useSignal } from "@preact/signals-react";
import { isDarkMode } from "../../store/darkMode";
import BookingDetailsPopup from "../BookingDetailsPopup";
import { getUserBookings } from "../../api/bookings/getUserBookings";
import user from "../../api/user";
import { getUserFutureBookings } from "../../api/bookings/getUserFutureBookings";
import { listBookings } from "../../api/bookings/listBookings";
import ReservationForm from "../ReservationForm";
import { updateBooking } from "../../api/bookings/updateBooking";
import Popup from "../Popup";
import { deleteBooking } from "../../api/bookings/deleteBooking";
import Loading from "../Loading";
import { t } from "i18next";

const Bookings = ({ currentUserBookings }) => {
  const activeToggle = useSignal("myBookings");
  const bookings = useSignal([]);
  const sliderRef = useRef(null);
  const isBookingDetailsPopup = useSignal(false);
  const bookingDetails = useSignal(null);
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);
  const isEditPopup = useSignal(false);
  const isDeletePopup = useSignal(false);
  const formRef = useRef(null);
  const selectedBookingId = useSignal(null);
  const editSuccess = useSignal(false);
  const deleteSuccess = useSignal(false);

  const toggleList = [
    {
      title: "My Bookings",
      value: "myBookings",
    },
    {
      title: "All users bookings",
      value: "allBookings",
    },
    {
      title: "Booking History",
      value: "bookingHistory",
    },
  ];

  // const myBookingInfo = [
  //   {
  //     bookingID: 1,
  //     startTime: "2024-06-03T15:50:00",
  //     endTime: "2024-06-03T18:00:00",
  //     chargingDone: "2022-04-26T16:00:00",
  //     status: "P",
  //     comment: "Bytte av motor",
  //     bookingOwner: "Jens Lien",
  //     bookingOwnerNumber: "93215646",
  //     isOfficial: false,
  //     boatName: "testboat",
  //   },
  // ];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    // autoplaySpeed: 4000,
    cssEase: "linear",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 426,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // fetch bookings
  const getBookings = async () => {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      if (activeToggle.value === "myBookings") {
        const response = await getUserFutureBookings({
          userId: user?.data?.value?.id,
        });
        // bookings.value = myBookingInfo;
        // currentUserBookings.value = myBookingInfo;
        if (response.status === 401) {
          throw Error("Auth Token expired! Please re-login");
        }
        const data = await response.json();
        bookings.value = data;
        currentUserBookings.value = data;
        // console.log(res);
      } else if (activeToggle.value === "allBookings") {
        const response = await listBookings();
        if (response.status === 401) {
          throw Error("Auth Token expired! Please re-login");
        }
        // console.log(res);
        const data = await response.json();
        bookings.value = data;
      } else {
        const response = await listBookings();
        if (response.status === 401) {
          throw Error("Auth Token expired! Please re-login");
        }
        const data = await response.json();
        const currentUserAllBookings = data?.filter(
          (booking) =>
            booking.bookingOwnerNumber === user?.data.value?.phone &&
            booking.bookingOwner === user?.data.value?.name
        );
        // console.log(currentUserBookings);
        bookings.value = currentUserAllBookings;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    getBookings();
  }, [activeToggle.value, user.data.value]);

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const hanldeBookingDetailsPopup = (info) => {
    isBookingDetailsPopup.value = true;
    bookingDetails.value = info;
  };

  // update bookings

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    isLoading.value = true;
    errorMessage.value = null;
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { boatId, startTime, endTime } = formDataObj;
        if (!selectedBookingId.value) return;
        // If start time and end time are equal, return with an error message
        if (new Date(endTime) - new Date(startTime) <= 0)
          throw Error("Please select different end time!");

        const response = await updateBooking({
          boatID: boatId.toString(),
          startTime: startTime.toString(),
          endTime: endTime.toString(),
          userID: user.data.value?.id,
          bookingID: selectedBookingId.value,
          isOfficial: true,
        });

        if (response.status === 401) {
          throw Error("Auth Token expired! Please re-login");
        }
        if (response.status === 400) {
          throw Error("Bookings can only be made 0 days in advance.");
        }

        // console.log(formDataObj);
        // console.log("selected date range", startDate, endDate);
        editSuccess.value = true;
        isEditPopup.value = false;
        e.target.reset();
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  // delete bookings
  const handleDeleteBooking = async () => {
    if (!selectedBookingId.value) return;
    errorMessage.value = null;
    try {
      const response = await deleteBooking({
        bookingId: selectedBookingId.value,
      });
      if (response.status === 401) {
        throw Error("Auth Token expired! Please re-login");
      }
      if (response.status === 500) {
        return (deleteSuccess.value = true), (isDeletePopup.value = false);
      }
      isDeletePopup.value = false;
      deleteSuccess.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        if (error.message.includes("Internal Server Error")) {
          errorMessage.value = error.message;
          (deleteSuccess.value = true), (isDeletePopup.value = false);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-20 sm:mb-12 relative">
      <Typography size="h6/bold" variant={isDarkMode.value ? "darkModeOn" : ""}>
        {t("Bookings")}
      </Typography>
      <div className="flex items-center gap-1 sm:gap-4">
        {toggleList.map((toggle, index) => (
          <Button
            key={index}
            type="button"
            title="Toggle"
            className={`!bg-transparent  capitalize !shadow-none  !p-1 border-current !rounded-none ${
              activeToggle.value === toggle.value ? "border-b-2" : "border-none"
            } ${isDarkMode.value ? "!text-primary-100" : "!text-primary-600"}`}
            onClick={() => (activeToggle.value = toggle.value)}
          >
            {t(toggle.title)}{" "}
            {activeToggle.value === toggle.value
              ? `(${bookings.value.length})`
              : null}
          </Button>
        ))}
      </div>
      <div className="flex justify-end items-center gap-2">
        <Button
          type="button"
          onClick={handlePrev}
          title="Prev"
          variant="icon"
          className="bg-container_light dark:bg-container_dark w-8 text-secondary-600 !p-1 disabled:bg-primary-400 shadow"
          aria-label="Previous"
        >
          <HiOutlineChevronLeft className="w-full h-full" />
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          title="Next"
          variant="icon"
          className="bg-container_light dark:bg-container_dark w-8 text-secondary-600 !p-1 disabled:bg-primary-400 shadow"
          aria-label="Next"
        >
          <HiOutlineChevronRight className="w-full h-full" />
        </Button>
      </div>

      {!isLoading.value ? (
        bookings.value?.length ? (
          <Slider {...settings} ref={sliderRef}>
            {bookings.value.map((info, index) => (
              <BookingCard
                key={index}
                info={info}
                activeToggle={activeToggle.value}
                selectedBookingId={selectedBookingId}
                isEditPopup={isEditPopup}
                isDeletePopup={isDeletePopup}
                hanldeBookingDetailsPopup={hanldeBookingDetailsPopup}
              />
            ))}
          </Slider>
        ) : (
          <div className="flex  items-center">
            <Typography
              size="body1/semi-bold"
              variant="error"
              className="bg-white p-2 rounded"
            >
              {t("No Booking Detail found")}
            </Typography>
          </div>
        )
      ) : (
        <div className="p-4 ">
          <Loading loadingText={t("Loading...")} />
        </div>
      )}

      {/* error messages */}
      {errorMessage.value ? (
        <div className="absolute bottom-0  w-full flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl flex items-center gap-4">
            <Typography variant="error">{t(errorMessage.value)}</Typography>

            <Button
              type="button"
              variant="icon"
              onClick={() => (errorMessage.value = null)}
              aria-label="Close"
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
        </div>
      ) : null}
      <BookingDetailsPopup
        isPopup={isBookingDetailsPopup}
        bookingDetails={bookingDetails}
        activeToggle={activeToggle.value}
      />

      {isEditPopup.value ? (
        <ReservationForm
          isPopup={isEditPopup}
          isLoading={isLoading}
          errorMessage={errorMessage}
          handlePopupAction={handleUpdateBooking}
          actionText={"Update"}
          formRef={formRef}
          selectedBookingId={selectedBookingId}
          variant="edit"
        />
      ) : null}
      <Popup
        icon={<HiOutlineCheck size={100} />}
        iconClassName={"bg-secondary-600 text-white"}
        isPopup={editSuccess}
        handlePopupAction={() => window.location.reload()}
        actionText={t("Go To Your Booking")}
        title={t("Booking Updated")}
        subtitle={t("Your booking have been updated successfully")}
      />
      <Popup
        icon={<HiOutlineCheck size={100} />}
        iconClassName={"bg-secondary-600 text-white"}
        isPopup={deleteSuccess}
        handlePopupAction={() => window.location.reload()}
        actionText={t("Go To Your Booking")}
        title={t("Booking Deleted")}
        subtitle={t("Your booking have been deleted successfully")}
      />

      <Popup
        icon={<HiOutlineTrash size={50} />}
        iconClassName={"bg-teritary-50 text-teritary-600 p-6"}
        isPopup={isDeletePopup}
        actionText={t("Yes,Sure")}
        handlePopupAction={handleDeleteBooking}
        handleSeconaryAction={() => (isDeletePopup.value = false)}
        secondaryActionText={t("No")}
        title={t("Are you sure want to delete this booking?")}
        subtitle={`${t("This action will permanently delete booking ID")} ${
          selectedBookingId.value
        }`}
      />
    </div>
  );
};

export default Bookings;
