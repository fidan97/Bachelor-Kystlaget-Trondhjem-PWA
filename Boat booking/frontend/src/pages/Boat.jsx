import React, { useEffect } from "react";
import Topbar from "../components/Topbar";
import Menubar from "../components/Menubar";
import { isDarkMode } from "../store/darkMode";
import Typography from "../components/Typography";
import Button from "../components/Button";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useSignal } from "@preact/signals-react";
import { tideApi } from "../api/tideApi";
import Loading from "../components/Loading";
import { t } from "i18next";
Chart.register(CategoryScale);

const Boat = () => {
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);
  const localTideData = JSON.parse(localStorage.getItem("localTideData"));

  const tideData = useSignal(localTideData ?? []);

  const getTideData = async () => {
    isLoading.value = true;
    errorMessage.value = null;
    const lat = 63.43048;
    const lng = 10.39506;
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    today.setDate(today.getDate() + 7);
    const endDate = today.toISOString().split("T")[0];
    try {
      const res = await tideApi({ lat, lng, startDate, endDate });
      if (res.status !== 200) {
        throw Error(
          res.statusText === "Payment Required"
            ? "API quota exceeded"
            : res.statusText
        );
      }
      const data = await res.json();
      // console.log(data);
      tideData.value = data?.data;
      localStorage.setItem("localTideData", JSON.stringify(data?.data));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const todayDataExist = tideData.value?.some(
    (item) => new Date(item.time).toDateString() === new Date().toDateString()
  );

  useEffect(() => {
    if (!todayDataExist) getTideData();
  }, []);
  const state = {
    labels: tideData.value?.map(
      (item) => new Date(item?.time).toISOString().split("T")[0]
    ),
    datasets: [
      {
        label: "Tide",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "#D4009D",
        borderColor: "#AAD922",
        borderWidth: 2,
        data: tideData.value?.map((item) => item.height),
      },
    ],
  };
  Chart.defaults.color = isDarkMode.value ? "#ffff" : "#2e4369";
  Chart.defaults.borderColor = isDarkMode.value ? "#52678E" : "#2e4369";

  return (
    <div className={`w-full sm:max-w-calc ml-auto `}>
      <Menubar />
      <div className="w-full flex flex-col gap-8 p-8 mb-20 sm:mb-12">
        <Topbar />

        <div
          className={`bg-container_light dark:bg-container_dark p-4 flex flex-col gap-4 rounded-lg`}
        >
          <Typography
            size="body1/bold"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {t("Boat")}
          </Typography>
          {!isLoading.value ? (
            <div className="flex flex-col gap-4">
              <div>
                <Line
                  data={state}
                  options={{
                    title: {
                      display: true,
                      text: "Average Rainfall per month",
                      fontSize: 20,
                    },
                    legend: {
                      display: true,
                      position: "right",
                    },
                  }}
                />
              </div>

              <Button
                link="https://nais.kystverket.no/marinogram/10.39506_63.43048"
                target={"_blank"}
                variant="secondary"
                title={"View More On kystverket"}
                className="capitalize !rounded-3xl !px-6 !text-primary-600 bg-gradient-to-t from-secondary-500 to-secondary-200"
              >
                {t("View More On kystverket")}
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

export default Boat;
