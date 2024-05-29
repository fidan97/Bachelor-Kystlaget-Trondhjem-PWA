import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import Menubar from "../components/Menubar";
import { isDarkMode } from "../store/darkMode";
import Typography from "../components/Typography";
import { useSignal } from "@preact/signals-react";
import { PiWind } from "react-icons/pi";
import { BsWater } from "react-icons/bs";
import { WiHumidity } from "react-icons/wi";
import { IoChevronForwardCircle, IoCompassOutline } from "react-icons/io5";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { IoMdRefresh } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";
import { weatherData } from "../store/weatherData";
import { currentWeatherApi } from "../api/weather/current";
import { forcastWeatherApi } from "../api/weather/forcast";
import { sunUpDownTimeApi } from "../api/weather/sunUpDown";
import { weatherIcons } from "../utils/weatherIcon";

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
      bottomTitle: "feel like",
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
      bottomTitle: "sun rise",
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
      bottomTitle: "sun set",
      icon: "images/weather/ico-3d-sunset.svg",
    },
    {
      title: "wind speed",
      value: `${currentWeather.value?.wind?.speed}`,
      bottomTitle: "m/s",
      icon: "images/weather/ico-3d-wind-2.svg",
    },
  ];

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
          className={` ${
            isDarkMode.value ? "bg-primary-700" : "bg-primary-600"
          } p-4 flex flex-col gap-4 rounded-lg relative`}
        >
          <Typography size="body1/bold" className="!text-white">
            Weather
          </Typography>

          <div className="flex justify-end items-center">
            <Button
              type="button"
              variant="icon"
              className="gap-2 items-center text-primary-100"
            >
              Next 7 days
            </Button>
            <Button
              type="button"
              variant="icon"
              className="gap-2 items-center text-primary-100 disabled:text-primary-400"
              disabled={true}
            >
              Next 14 days
            </Button>
            <Button
              type="button"
              variant="icon"
              className="gap-2 items-center text-primary-100 disabled:text-primary-400"
              disabled={true}
            >
              Next 1 month
            </Button>
          </div>

          {!isLoading.value ? (
            <div className=" flex flex-col gap-4">
              <div className="flex items-center gap-4 flex-col lg:flex-row">
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
                    <Typography size="small/noraml" className="!text-white">
                      Today
                    </Typography>
                    <Typography size="h5/semi-bold" className="!text-white">
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
                      <div className="bg-primary-500 p-4 rounded-lg flex-col items-center gap-4 h-24 w-20 hidden sm:flex ">
                        <Typography
                          size="body1/semi-bold"
                          className="!text-white"
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
                            className="!text-white"
                          >
                            {weather.bottomTitle}
                          </Typography>
                        </div>
                      </div>

                      <div className="block sm:hidden">
                        <Typography size="small/noraml" className="!text-white">
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
                    className="bg-primary-500 p-4 rounded-lg flex flex-col items-center gap-4 w-40"
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
                      className="!text-white capitalize"
                    >
                      {new Date(weather.start).toLocaleDateString("default", {
                        weekday: "long",
                      })}
                    </Typography>
                    <Typography size="body1/semi-bold" className="!text-white">
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
                className="capitalize !rounded-xl !px-6 !text-primary-600 bg-gradient-to-t from-secondary-500 to-secondary-200"
              >
                View More On YR
              </Button>
            </div>
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

export default Weather;
