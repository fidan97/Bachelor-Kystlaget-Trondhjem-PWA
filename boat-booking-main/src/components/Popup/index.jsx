import React, { useEffect } from "react";
import Typography from "../Typography";
import Button from "../Button";
import { isDarkMode } from "../../store/darkMode";

const Popup = ({
  isPopup,
  icon,
  title,
  subtitle,
  actionLink,
  actionText,
  iconClassName,
  secondaryActionLink,
  secondaryActionText,
  handlePopupAction,
  handleSeconaryAction,
  toggleValue,
  handleToggle,
}) => {
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
      <div className="absolute w-10/12  rounded-2xl transition-all p-6 max-w-sm bg-container_light dark:bg-container_dark">
        <div className="flex items-center justify-end">
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
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center justify-center">
            <div className={`rounded-full ${iconClassName}`}>{icon}</div>
          </div>
          <Typography
            size="h6/bold"
            className="text-center"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {title}
          </Typography>
          <Typography
            size="body2/normal"
            className="text-center"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {subtitle}
          </Typography>

          {!toggleValue ? (
            <div className=" w-full flex justify-evenly gap-4 items-center">
              {actionLink ? (
                <Button
                  link={actionLink}
                  title={actionText}
                  variant="secondary"
                  className="capitalize !rounded-xl !px-6 !text-primary-600 bg-gradient-to-t from-secondary-500 to-lime-200"
                >
                  {actionText}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  title={actionText}
                  className={`${
                    actionText ? "flex" : "hidden"
                  } capitalize !rounded-xl !px-6 !text-primary-600 bg-gradient-to-t from-secondary-500 to-secondary-200`}
                  onClick={handlePopupAction}
                >
                  {actionText}
                </Button>
              )}
              {secondaryActionLink ? (
                <Button
                  link={secondaryActionLink}
                  variant="teritary"
                  title={secondaryActionText}
                  className="capitalize !rounded-2xl !px-6 !text-primary-600 bg-gradient-to-t from-teritary-500 to-teritary-200"
                >
                  {secondaryActionText}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="teritary"
                  title={secondaryActionText}
                  className={`${
                    secondaryActionText ? "flex" : "hidden"
                  } capitalize !rounded-2xl !px-6`}
                  onClick={handleSeconaryAction}
                >
                  {secondaryActionText}
                </Button>
              )}
            </div>
          ) : (
            <div className=" flex items-center gap-2">
              <Typography className="!text-teritary-600">OFF</Typography>
              <Button
                type="button"
                variant="icon"
                className={`${
                  toggleValue.value ? "bg-secondary" : "bg-teritary"
                } relative h-9 w-20 !p-0 !justify-normal flex-shrink-0 !rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                onClick={handleToggle}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    toggleValue.value ? "translate-x-11" : "translate-x-0"
                  }  pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                ></span>
              </Button>
              <Typography className="!text-secondary-600">ON</Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
