import React from "react";
import Button from "../Button";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BiBell, BiSolidBell, BiLogOutCircle } from "react-icons/bi";
import { BsFillSunFill, BsSun } from "react-icons/bs";
import { PiBoat, PiBoatFill } from "react-icons/pi";
import { HiOutlineUser, HiUser } from "react-icons/hi";
import { authToken } from "../../store/authToken";
import { isDarkMode } from "../../store/darkMode";
import { Link } from "react-router-dom";

const Menubar = () => {
  const menuTopOptions = [
    {
      title: "home",
      OtlineIcon: AiOutlineHome,
      FillIcon: AiFillHome,
      link: "/home",
    },
    {
      title: "notification",
      OtlineIcon: BiBell,
      FillIcon: BiSolidBell,
      link: "/notification",
    },
    {
      title: "weather",
      OtlineIcon: BsSun,
      FillIcon: BsFillSunFill,
      link: "/weather",
    },
    {
      title: "boat",
      OtlineIcon: PiBoat,
      FillIcon: PiBoatFill,
      link: "/boat",
    },
    {
      title: "profile",
      OtlineIcon: HiOutlineUser,
      FillIcon: HiUser,
      link: "/profile",
    },
  ];

  const handleLogout = () => {
    authToken.value = null;
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const activeLink = window.location.pathname;

  return (
    <div
      className={`bg-container_light dark:bg-container_dark fixed bottom-0 sm:top-0 left-0 flex flex-col gap-4 h-20 sm:h-full w-full sm:w-32 justify-between items-center p-4 sm:p-10 z-10`}
    >
      <div className="flex sm:flex-col justify-center sm:justify-evenly gap-4 w-full items-center">
        <Link to="/home">
          <img
            src="/images/logo.svg"
            alt="logo"
            className="bg-white border-primary-500 border-2 h-12 p-1 rounded-lg w-12 hidden sm:block"
          />
        </Link>
        <div className="flex sm:flex-col items-center gap-4">
          {menuTopOptions.map((option, index) => (
            <Button
              key={index}
              link={option.link}
              variant="icon"
              className={`text-primary-500 dark:text-primary-300 w-12 ${
                option.title === "home" ? " sm:hidden" : ""
              }`}
              title={option.title.toUpperCase()}
            >
              {activeLink.includes(option.link) ? (
                <option.FillIcon className="w-full h-full fill-lime-500" />
              ) : (
                <option.OtlineIcon className="w-full h-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      <Button
        type="button"
        variant="icon"
        title={"Logout".toUpperCase()}
        className="text-primary-500 dark:text-primary-300 w-12 hidden sm:block"
        onClick={handleLogout}
      >
        <BiLogOutCircle className="w-full h-full" />
      </Button>
    </div>
  );
};

export default Menubar;
