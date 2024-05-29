import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import Menubar from "../components/Menubar";
import { isDarkMode } from "../store/darkMode";
import Typography from "../components/Typography";
import Button from "../components/Button";
import { signal, useSignal } from "@preact/signals-react";
import { getUserFutureBookings } from "../api/bookings/getUserFutureBookings";
import user from "../api/user";
import Loading from "../components/Loading";

const Notification = ({ notificationList, isLoading, errorMessage }) => {
  const removeNotification = (id) => {
    const updatedNotification = notificationList.value?.filter(
      (notification) => notification.id !== id
    );
    notificationList.value = updatedNotification;
  };

  return (
    <div
      className={`w-full sm:max-w-calc ml-auto bg-gradient-to-b ${
        isDarkMode.value
          ? "from-gray-800 to-slate-950"
          : "from-gray-300 to-slate-400"
      }   `}
    >
      <Menubar />
      <div className="w-full flex flex-col gap-8 p-8 mb-20 sm:mb-12">
        <Topbar />

        <div
          className={`${
            isDarkMode.value ? "bg-primary-700" : "bg-primary-600"
          }  p-4 flex flex-col gap-4 rounded-lg`}
        >
          <Typography size="body1/bold" className="!text-white">
            Notification
          </Typography>

          {!isLoading.value ? (
            notificationList.value?.length ? (
              notificationList.value?.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex justify-between items-center gap-4  p-1 px-4 rounded-md ${
                    isDarkMode.value
                      ? "bg-transparent border"
                      : "bg-primary-500"
                  }`}
                >
                  <div>
                    <Typography className="!text-white">
                      {notification.title}{" "}
                    </Typography>
                    <Typography
                      size="small/normal"
                      className="!text-primary-300"
                    >
                      {notification.notificationTime}
                    </Typography>
                  </div>
                  <Button
                    type="button"
                    variant="icon"
                    className="bg-teritary-600 !rounded-full text-white !p-1"
                    onClick={() => removeNotification(notification.id)}
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
              ))
            ) : (
              <Typography className="!text-white capitalize">
                No Notification found
              </Typography>
            )
          ) : (
            <div className="p-4 ">
              <Loading loadingText={"Loading"} />
            </div>
          )}
          {errorMessage.value ? (
            <Typography
              variant="error"
              className="text-center mt-2 bg-white rounded"
            >
              {errorMessage.value}
            </Typography>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Notification;
