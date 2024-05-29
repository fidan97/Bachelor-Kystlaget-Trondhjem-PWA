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
Chart.register(CategoryScale);

const Boat = () => {
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);
  const tideData = useSignal([]);

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
        throw Error(res.statusText);
      }
      const data = await res.json();
      // console.log(data);
      tideData.value = data?.data;
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
    getTideData();
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
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: tideData.value?.map((item) => item.height),
      },
    ],
  };
  Chart.defaults.color = "#ffff";
  Chart.defaults.borderColor = "#ffff";

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
          } p-4 flex flex-col gap-4 rounded-lg`}
        >
          <Typography size="body1/bold" className="!text-white">
            Boat
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
                className="capitalize !rounded-xl !px-6 !text-primary-600 bg-gradient-to-t from-secondary-500 to-secondary-200"
              >
                View More On kystverket
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
