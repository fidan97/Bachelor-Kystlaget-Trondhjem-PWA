import { cx } from "class-variance-authority";
import React, { useId } from "react";
import { isDarkMode } from "../../store/darkMode";

const Select = ({ label, options, defaultValue, className, ...rest }) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1 w-full">
      {label ? (
        <label
          htmlFor={id}
          className={`text-sm font-medium leading-6  flex gap-1 mb-1 ${
            isDarkMode.value ? "text-primary-100" : "text-primary-600"
          }`}
        >
          {label}
        </label>
      ) : null}
      <select
        id={id}
        className={cx(
          "rounded-md border-0 p-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset  focus:ring-primary-600 focus-visible:outline-none",
          isDarkMode.value
            ? "text-primary-100 bg-primary-700"
            : "text-primary-600",
          className
        )}
        {...rest}
        defaultValue={defaultValue}
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
