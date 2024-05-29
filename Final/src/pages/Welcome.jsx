import React, { useRef } from "react";
import Typography from "../components/Typography";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Input from "../components/Input";
import { useSignal } from "@preact/signals-react";
import { isDarkMode } from "../store/darkMode";
import { t } from "i18next";

const Welcome = () => {
  const inputRef = useRef(null);
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);

  const handleToken = async () => {
    isLoading.value = true;
    try {
      if (inputRef.current) {
        const response = await fetch("/api/User/Profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${inputRef.current?.value}`,
          },
        });
        if (response.status === 401) {
          return (errorMessage.value = `${response.statusText} invaild token!`);
        }
        const data = await response.json();
        // console.log(data);
        window.location.href = "/home";
        localStorage.setItem("token", JSON.stringify(inputRef.current?.value));
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

  // const handleAuth = useGoogleLogin({
  //   onSuccess: (res) => {
  //     window.location.href = "/home";
  //     localStorage.setItem("token", JSON.stringify(res.access_token));
  //   },
  //   onError: (error) => console.log("Login Failed:", error),
  // });

  return (
    <div className="flex items-center justify-between w-full sm:h-screen ">
      <div
        className={` my-0 sm:my-4 h-full p-2 sm:p-10 w-full sm:w-1/2 ${
          isDarkMode.value ? "bg-primary-800" : "bg-white"
        }`}
      >
        <div className="flex flex-col h-full items-center justify-center w-full relative pb-16 sm:pb-0">
          <div className="absolute top-0 hidden sm:block sm:left-0  sm:top-10">
            <img
              src="/images/logo.svg"
              alt="logo"
              className={`w-14 h-14 ${
                isDarkMode.value ? "bg-primary-100 p-2 rounded-full" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-2 items-center w-full mt-4  sm:hidden">
            <img
              src="/images/logo.svg"
              alt="logo"
              className={`w-14 h-14 ${
                isDarkMode.value ? "bg-primary-100 p-2 rounded-full" : ""
              }`}
            />
            <div className="w-full h-80 overflow-hidden">
              <img
                src="/images/boat.jpg"
                alt="boat"
                className="w-full h-full object-cover block sm:hidden"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 my-10">
            <Typography
              size="body2/bold"
              variant={isDarkMode.value ? "darkModeOn" : "secondary"}
            >
              {t("Welcome To")}
            </Typography>
            <Typography
              size="h6/bold"
              variant={isDarkMode.value ? "darkModeOn" : ""}
            >
              {t("Kystlaget Trondheim")}
            </Typography>
            <Typography
              size="body2/semi-bold"
              variant={isDarkMode.value ? "darkModeOn" : "secondary"}
            >
              {t("Not a member yet?")}{" "}
              <Link to="#" className="text-lime-500">
                {t("Become a member")}
              </Link>
            </Typography>
            {/* <Button
              type="button"
              variant="primary"
              className="!w-full gap-4"
              // onClick={() => handleAuth()}
            >
              <img
                src="/images/google_logo.svg"
                alt="google_logo"
                className="w-5 h-5"
              />
              Login with your Google
            </Button> */}
            {/* <GoogleLogin
              auto_select={false}
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_blue"
            /> */}
            {/* for testing mode */}
            <div className="flex flex-col gap-4">
              <Typography
                size="body1/semi-bold"
                variant={isDarkMode.value ? "darkModeOn" : "error"}
              >
                {t("Login with your token")}
              </Typography>
              <Input
                type="text"
                label={t("Access token")}
                inputRef={inputRef}
              />
              <Button
                type="button"
                onClick={handleToken}
                className="hover:!bg-primary-700"
              >
                {isLoading.value ? "Please wait..." : t("Login")}
              </Button>
              {errorMessage.value ? (
                <Typography variant="error" className="my-4">
                  {errorMessage.value}
                </Typography>
              ) : null}
            </div>

            <Typography
              size="body2/noraml"
              variant={isDarkMode.value ? "darkModeOn" : "secondary"}
            >
              {t(
                "Here you can log in to Kystlaget Trondheim's booking system. To be able to log in, you must be a member of Kystlaget."
              )}
            </Typography>
          </div>
        </div>
      </div>

      <img
        src="/images/boat.jpg"
        alt="boat"
        className="w-1/2 h-full object-cover hidden sm:block"
      />
    </div>
  );
};

export default Welcome;
