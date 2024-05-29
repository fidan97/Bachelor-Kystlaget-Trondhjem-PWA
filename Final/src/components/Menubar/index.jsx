import React from "react";
import Button from "../Button";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BiBell, BiSolidBell, BiLogOutCircle } from "react-icons/bi";
import { BsFillSunFill, BsSun } from "react-icons/bs";
import { PiBoat, PiBoatFill } from "react-icons/pi";
import { HiOutlineUser, HiUser } from "react-icons/hi";
import { googleLogout } from "@react-oauth/google";
import { authToken } from "../../store/authToken";
import { isDarkMode } from "../../store/darkMode";

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
    googleLogout();
    authToken.value = null;
    localStorage.removeItem("token");
  };

  const activeLink = window.location.pathname;

  return (
    <div
      className={`${
        isDarkMode.value ? "bg-primary-700" : "bg-primary-600 "
      } fixed bottom-0 sm:top-0 left-0 flex flex-col gap-4 h-20 sm:h-full w-full sm:w-32 justify-between items-center p-4 sm:p-10 z-10`}
    >
      <div className="flex sm:flex-col justify-evenly gap-4 w-full items-center">
        <img
          src="/images/logo.svg"
          alt="logo"
          className="bg-white border-primary-300 border-2 border-c h-12 p-1 rounded-lg w-12 hidden sm:block"
        />
        <div className="flex sm:flex-col  items-center gap-4">
          {menuTopOptions.map((option, index) => (
            <Button
              key={index}
              link={option.link}
              variant="icon"
              className="text-primary-300 w-12"
              title={option.title.toUpperCase()}
            >
              {activeLink.includes(option.link) ? (
                <option.FillIcon className="w-full h-full fill-lime-400" />
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
        className="text-primary-300 w-12 hidden sm:block"
        onClick={handleLogout}
      >
        <BiLogOutCircle className="w-full h-full" />
      </Button>
    </div>
  );
};

export default Menubar;
