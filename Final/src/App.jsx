import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Profile from "./pages/Profile";
import Notification from "./pages/Notification";
import Weather from "./pages/Weather";
import Boat from "./pages/Boat";
import { authToken } from "./store/authToken";
import { useSignal } from "@preact/signals-react";
import user from "./api/user";
import { getUserFutureBookings } from "./api/bookings/getUserFutureBookings";
import { currentWeatherApi } from "./api/weather/current";
import { forcastWeatherApi } from "./api/weather/forcast";
// import { weatherApi } from "./api/weatherApi";

const App = () => {
  const PrivateRoutes = () => {
    return authToken.value ? <Outlet /> : <Navigate to="/" />;
  };

  // states for notifications
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);
  const notificationList = useSignal([]);
  // weather states
  const sevenDaysForcast = useSignal([]);

  // get weather
  const getWeather = async () => {
    try {
      const forcastRes = await forcastWeatherApi();
      sevenDaysForcast.value = forcastRes?.dayIntervals.slice(0, 7);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWeather();
  }, []);

  function notifyMe() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (window.Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      notificationList.value?.map(
        (notification) =>
          new window.Notification("Booking Alert!", {
            body: `Hi user! ${notification.title}`,
            icon: "/images/logo.svg",
          })
      );
    } else if (window.Notification.permission !== "denied") {
      // We need to ask the user for permission
      window.Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          notificationList.value?.map(
            (notification) =>
              new window.Notification("Booking Alert!", {
                body: `Hi user! ${notification.title}`,
                icon: "/images/logo.svg",
              })
          );
        }
      });
    }
  }
  // fetch bookings
  const getBookings = async () => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      if (user?.data.value) {
        const response = await getUserFutureBookings({
          userId: user?.data?.value?.id,
        });

        if (response.status === 401) {
          throw Error("Auth Token expired! Please re-login");
        }
        const data = await response.json();
        const upcomingBookings = data?.filter((item) => {
          const hours =
            new Date(item.startTime).getHours() - new Date().getHours();
          const minutes =
            new Date(item.startTime).getMinutes() - new Date().getMinutes();
          const totalMinutes = hours * 60 + minutes;
          return (
            new Date(item.startTime).toDateString() ===
              new Date().toDateString() && totalMinutes >= 5
          );
        });

        if (upcomingBookings?.length) {
          upcomingBookings?.map(
            (booking, index) =>
              (notificationList.value = [
                ...notificationList.value,
                {
                  id: index,
                  title: `You have an upcoming booking at ${new Date(
                    booking.startTime
                  ).toLocaleString()}`,
                  notificationTime: new Date().toLocaleTimeString(),
                },
              ])
          );
          upcomingBookings?.map((booking, index) => {
            // find weather conditions at booking starting time
            const windSpeed = sevenDaysForcast.value?.find(
              (weather) =>
                new Date(weather.start).toDateString() ===
                new Date(booking.startTime).toDateString()
            )?.wind?.max;
            if (windSpeed >= 5) {
              notificationList.value = [
                ...notificationList.value,
                {
                  id: index,
                  title: ` Warning! Unfortunately, due to extreme weather conditions your booking is not possible at ${new Date(
                    booking.startTime
                  ).toLocaleString()}`,
                  notificationTime: new Date().toLocaleTimeString(),
                },
              ];
            }
          });
          notifyMe();
        }
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
    if (authToken.value) {
      getBookings();
    }
  }, [user.data.value]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            authToken.value ? <Navigate to="/home" replace /> : <Welcome />
          }
        />

        {/* private routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route
            path="/notification"
            element={
              <Notification
                errorMessage={errorMessage}
                isLoading={isLoading}
                notificationList={notificationList}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/boat" element={<Boat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
