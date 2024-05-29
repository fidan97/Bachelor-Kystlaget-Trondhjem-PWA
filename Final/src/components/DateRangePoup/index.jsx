import React, { useEffect } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, Calendar } from "react-date-range";
import Typography from "../Typography";
import Button from "../Button";

const DateRangePopup = ({ isPopup, dateRange, handleDateRange }) => {
  // useEffect(() => {
  //   document.body.style.overflow = isPopup.value ? "hidden" : "auto";
  // }, [isPopup.value]);

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
      <div className="absolute w-10/12 bg-white rounded-2xl transition-all p-2 max-w-sm sm:max-w-xl">
        <div className="my-1">
          <div className="flex items-center justify-between ">
            <Typography size="body1/semi-bold" className="capitalize">
              Select Date Range
            </Typography>
            <Button
              type="button"
              variant="icon"
              onClick={() => (isPopup.value = false)}
              className="bg-primary-100 !p-1 !rounded-full hover:bg-danger-600 hover:text-white"
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
          <Typography size="small/normal">
            Please select your start and end date
          </Typography>
        </div>
        <DateRangePicker
          onChange={(item) => handleDateRange(item)}
          showSelectionPreview={false}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={dateRange.value}
          showDateDisplay={false}
          direction="horizontal"
          className="w-full p-0 sm:p-4"
        />
        <Button
          type="button"
          className="!rounded-2xl"
          onClick={() => (isPopup.value = false)}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default DateRangePopup;
