import React, { useId } from "react";
import { isDarkMode } from "../../store/darkMode";
import ReactSelect from "react-select";

const Select = ({ label, options, className, ...rest }) => {
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
      <ReactSelect
        className="bg-white dark:bg-container_dark border-primary-500"
        options={options}
        formatOptionLabel={(opt) => (
          <div className="flex items-center gap-2 dark:bg-container_dark dark:text-primary-50">
            <img width={20} height={20} src={opt.image} alt="opt-image" />
            <span>{opt.label}</span>
          </div>
        )}
        {...rest}
      />
    </div>
  );
};

export default Select;
