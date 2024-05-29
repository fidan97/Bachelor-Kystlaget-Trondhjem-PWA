import React, { useEffect } from "react";
import Typography from "../Typography";
import Button from "../Button";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { isDarkMode } from "../../store/darkMode";
import user from "../../api/user";
import { useTranslation } from "react-i18next";

const Topbar = () => {
  useEffect(() => {
    document.body.style.background = isDarkMode.value ? "#020617" : "";
  }, [isDarkMode.value]);

  localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode.value));

  const { t } = useTranslation("translation");

  return (
    <div className="flex justify-between w-full items-center ">
      <div className="flex justify-center items-center gap-3">
        <img
          src={"/images/placeholderImg.svg"}
          alt="user"
          className={`w-10 h-10 border p-1 border-primary-900 rounded-full ${
            isDarkMode.value ? "bg-primary-100" : ""
          }`}
        />
        <div>
          <Typography size="body2/semi-bold" className="!text-teritary-600">
            {t("Hi")}
          </Typography>
          <Typography
            size="body1/semi-bold"
            variant={isDarkMode.value ? "darkModeOn" : ""}
          >
            {user.data.value?.name}
          </Typography>
        </div>
      </div>

      <Button
        type="button"
        variant="icon"
        title={"theme".toUpperCase()}
        className="text-primary-600 w-10"
        onClick={() => (isDarkMode.value = !isDarkMode.value)}
      >
        {isDarkMode.value ? (
          <BsSun className="w-full h-full text-primary-100" />
        ) : (
          <BsMoonStars className="w-full h-full" />
        )}
      </Button>
    </div>
  );
};

export default Topbar;
