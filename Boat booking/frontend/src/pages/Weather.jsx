import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import Menubar from "../components/Menubar";
import { isDarkMode } from "../store/darkMode";
import Typography from "../components/Typography";
import { useSignal } from "@preact/signals-react";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { currentWeatherApi } from "../api/weather/current";
import { forcastWeatherApi } from "../api/weather/forcast";
import { sunUpDownTimeApi } from "../api/weather/sunUpDown";
import { weatherIcons } from "../utils/weatherIcon";
import { t } from "i18next";

const Weather = () => {
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);
  const currentWeather = useSignal([]);
  const forcastWeather = useSignal([]);
  const sevenDaysForcast = useSignal([]);
  const sunLight = useSignal([]);

  // get weather
  const getWeather = async () => {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      const response = await currentWeatherApi();
      const forcastRes = await forcastWeatherApi();
      const sunLightTimeRes = await sunUpDownTimeApi();
      // console.log(response);
      currentWeather.value = response;
      forcastWeather.value = forcastRes;
      sevenDaysForcast.value = forcastRes?.dayIntervals.slice(0, 7);
      const sunriseTime = sunLightTimeRes?.find(
        (event) => event.type === "sunrise"
      )?.time;
      const sunsetTime = sunLightTimeRes?.find(
        (event) => event.type === "sunset"
      )?.time;
      sunLight.value = { sunriseTime, sunsetTime };
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
    getWeather();
  }, []);

  const weatherTopSections = [
    {
      title: "feel like",
      value: `${currentWeather.value?.temperature?.feelsLike}℃`,
      bottomTitle: `${t("feel like")}`,
      icon: "",
    },
    {
      title: "precipitation",
      value: `${currentWeather.value?.precipitation?.value}`,
      bottomTitle: "mm",
      icon: "images/weather/ico-3d-umbrella-4.svg",
    },
    {
      title: "wave speed",
      value: `N/A`,
      bottomTitle: "ms",
      icon: "images/weather/ico-3d-wave.svg",
    },
    {
      title: "sun rise",
      value: new Date(sunLight.value?.sunriseTime).toLocaleTimeString(
        "default",
        {
          hour12: false,
        }
      ),
      bottomTitle: `${t("sunrise")}`,
      icon: "images/weather/ico-3d-sunlight.svg",
    },
    {
      title: "sun set",
      value: new Date(sunLight.value?.sunsetTime).toLocaleTimeString(
        "default",
        {
          hour12: false,
        }
      ),
      bottomTitle: `${t("sunset")}`,
      icon: "images/weather/ico-3d-sunset.svg",
    },
    {
      title: "wind speed",
      value: `${currentWeather.value?.wind?.speed}`,
      bottomTitle: "m/s",
      icon: "images/weather/ico-3d-wind-2.svg",
    },
  ];

  const dayTranslations = {
    Monday: t("Monday"),
    Tuesday: t("Tuesday"),
    Wednesday: t("Wednesday"),
    Thursday: t("Thursday"),
    Friday: t("Friday"),
    Saturday: t("Saturday"),
    Sunday: t("Sunday"),
  };

  return (
    <div className={`w-full sm:max-w-calc ml-auto `}>
      <Menubar />
      <div className="w-full flex flex-col gap-8 p-8 mb-20 sm:mb-12">
        <Topbar />

        <div
          className={`bg-container_light dark:bg-container_dark
           p-4 flex flex-col gap-4 rounded-lg relative shadow`}
        >
          <Typography
            size="body1/bold"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {t("Weather")}
          </Typography>

          {!isLoading.value ? (
            <div className=" flex flex-col gap-4">
              <div className="flex items-center gap-4 flex-col lg:flex-row p-4 rounded-lg bg-primary_light dark:bg-primary_dark">
                {/* current temp */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      weatherIcons.find((parent) =>
                        parent.title.find((child) =>
                          child.includes(
                            currentWeather.value?.symbolCode?.next1Hour
                          )
                        )
                      )?.icon ?? "/images/weather/ico-3d-loading.svg"
                    }
                    alt="icon"
                    className="w-20 h-20"
                  />
                  <div className="flex flex-col gap-2">
                    <Typography
                      size="small/noraml"
                      variant={isDarkMode.value ? "darkModeOn" : ""}
                    >
                      {t("Today")}
                    </Typography>
                    <Typography
                      size="h5/semi-bold"
                      variant={isDarkMode.value ? "darkModeOn" : ""}
                    >
                      {currentWeather.value?.temperature?.value}℃
                    </Typography>
                    <Typography
                      size="small/noraml"
                      className="!text-white capitalize"
                    >
                      {currentWeather.value?.symbolCode?.next1Hour?.replace(
                        "_",
                        " "
                      )}
                    </Typography>
                  </div>
                </div>
                <div className="w-full grid grid-cols-3 pt-2 border-t gap-4 flex-col sm:flex-row sm:flex sm:border-none sm:p-0 sm:w-auto">
                  {weatherTopSections.map((weather, index) => (
                    <div key={index}>
                      <div className="bg-container_light dark:bg-container_dark shadow p-4 rounded-lg flex-col items-center gap-4 h-24 w-20 hidden sm:flex ">
                        <Typography
                          size="body1/semi-bold"
                          variant={isDarkMode.value ? "darkModeOn" : ""}
                        >
                          {weather.value}
                        </Typography>
                        <div className="flex items-center gap-2">
                          {!weather.bottomTitle.includes("feel") ? (
                            <img
                              src={weather.icon}
                              alt={weather.title}
                              className="w-5 h-5"
                            />
                          ) : null}
                          <Typography
                            size="small/noraml"
                            variant={isDarkMode.value ? "darkModeOn" : ""}
                          >
                            {weather.bottomTitle}
                          </Typography>
                        </div>
                      </div>

                      <div className="block sm:hidden">
                        <Typography
                          size="small/noraml"
                          variant={isDarkMode.value ? "darkModeOn" : ""}
                        >
                          {weather.value} {weather.bottomTitle}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto">
                {sevenDaysForcast.value?.map((weather, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg flex flex-col items-center gap-4 w-40 dark:bg-primary_dark"
                  >
                    <img
                      src={
                        weatherIcons.find((parent) =>
                          parent.title.find((child) =>
                            child.includes(weather?.twentyFourHourSymbol)
                          )
                        )?.icon
                          ? weatherIcons.find((parent) =>
                              parent.title.find((child) =>
                                child.includes(weather?.twentyFourHourSymbol)
                              )
                            )?.icon
                          : "/images/weather/ico-3d-loading.svg"
                      }
                      alt={weather?.twentyFourHourSymbol}
                      className="w-12 h-12"
                    />
                    <Typography
                      size="small/noraml"
                      className="capitalize"
                      variant={isDarkMode.value ? "darkModeOn" : ""}
                    >
                      {
                        dayTranslations[
                          new Date(weather.start).toLocaleDateString(
                            "default",
                            {
                              weekday: "long", //sun mon
                            }
                          )
                        ]
                      }
                    </Typography>

                    <Typography
                      size="body1/semi-bold"
                      variant={isDarkMode.value ? "darkModeOn" : ""}
                    >
                      {weather.temperature?.max}°/{weather.temperature.min}°
                    </Typography>
                    <Typography
                      size="small/noraml"
                      className="!text-white capitalize"
                    >
                      {weather.twentyFourHourSymbol?.replace("_", " ")}
                    </Typography>
                  </div>
                ))}
              </div>
              <Button
                link="https://www.yr.no/nb/v%C3%A6rvarsel/daglig-tabell/1-211102/Norway/Tr%C3%B8ndelag/Trondheim/Trondheim"
                target={"_blank"}
                variant="secondary"
                title={"View more on YR"}
                className="capitalize !rounded-3xl !px-6 !text-primary-600 bg-gradient-to-t from-secondary-500 to-secondary-200"
              >
                {t("View more on YR")}
              </Button>
            </div>
          ) : (
            <div className="p-4 ">
              <Loading loadingText={t("Loading...")} />
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

export default Weather;
