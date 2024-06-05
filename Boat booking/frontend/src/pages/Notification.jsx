import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import Menubar from "../components/Menubar";
import { isDarkMode } from "../store/darkMode";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { t } from "i18next";

const Notification = ({
  notificationList,
  isLoading,
  errorMessage,
  getNotificationFromServer,
}) => {
  const myServerUrl = import.meta.env.VITE_PUBLIC_MYSERVER_URL;

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${myServerUrl}/api/notification/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      getNotificationFromServer();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAllDelete = async () => {
    try {
      const res = await fetch(`${myServerUrl}/api/notification`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      getNotificationFromServer();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`w-full sm:max-w-calc ml-auto  `}>
      <Menubar />
      <div className="w-full flex flex-col gap-8 p-8 mb-20 sm:mb-12">
        <Topbar />

        <div
          className={`bg-container_light dark:bg-container_dark p-4 flex flex-col gap-4 rounded-lg shadow`}
        >
          <div className="flex items-center justify-between">
            <Typography
              size="body1/bold"
              variant={isDarkMode.value ? "darkModeOn" : ""}
            >
              {t("Notification")}
            </Typography>
            <Button
              type="button"
              variant="icon"
              className="bg-teritary !rounded-full disabled:opacity-50 text-white !p-1.5 !px-2 !text-xs gap-1  items-center"
              onClick={handleAllDelete}
              title="Delete all"
              disabled={notificationList.value.length === 0}
            >
              {t("Delete All")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </Button>
          </div>
          {!isLoading.value ? (
            notificationList.value?.length ? (
              notificationList.value?.map((notification, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center gap-4 border-b  p-1 pb-2 `}
                >
                  <div>
                    <Typography variant={isDarkMode.value ? "darkModeOn" : ""}>
                      {notification.title}{" "}
                    </Typography>
                    <Typography
                      size="small/normal"
                      variant={isDarkMode.value ? "darkModeOn" : ""}
                    >
                      {new Date(notification.date).toLocaleString()}
                    </Typography>
                  </div>
                  <Button
                    type="button"
                    variant="icon"
                    title="delete"
                    className="bg-teritary !rounded-full text-white !p-1"
                    onClick={() => handleDelete(notification.id)}
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
              <Typography
                className="capitalize"
                variant={isDarkMode.value ? "darkModeOn" : ""}
              >
                {t("No Notification Found")}
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
