import { cx } from "class-variance-authority";
import Button from "../Button";
import { useId } from "react";
import { isDarkMode } from "../../store/darkMode";

const Input = ({
  label,
  leftAdornment,
  rightAdornment,
  className,
  readOnlyInputId,
  inputRef,
  ...rest
}) => {
  const id = useId();

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`text-sm font-medium leading-6  flex gap-1 mb-1 ${
          isDarkMode.value ? "text-primary-100" : "text-primary-600"
        }`}
      >
        {label}
      </label>
      <div className="flex rounded-md">
        {leftAdornment ? (
          <span className="inline-flex items-center rounded-l-md pr-0 border border-r-0 border-primary-500 px-3 text-gray-500">
            {leftAdornment}
          </span>
        ) : null}
        <input
          id={id}
          ref={inputRef}
          className={cx(
            `block w-full rounded-md border-0 p-1.5 px-3  shadow-sm
            ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
            focus:ring-inset focus:ring-primary-600  sm:text-sm sm:leading-6 focus-visible:outline-none `,
            leftAdornment
              ? "rounded-l-none !border-l-0 !border border-primary-500  !ring-0 "
              : "rounded-l-md",
            rightAdornment
              ? "rounded-r-none !border-r-0 !border border-primary-500  !ring-0 "
              : "rounded-r-md",

            isDarkMode.value
              ? "text-primary-100 bg-primary-700"
              : "text-primary-600",

            className
          )}
          placeholder={label}
          readOnly={
            readOnlyInputId && rightAdornment
              ? readOnlyInputId.value === id
                ? false
                : true
              : false
          }
          {...rest}
        />
        {rightAdornment ? (
          <Button
            type="button"
            variant="icon"
            className={`!rounded-none !text-base items-center !rounded-r-md pl-0 border border-l-0 border-primary-500 px-3
              ${
                readOnlyInputId.value === id
                  ? "text-teritary-600"
                  : "text-gray-500"
              } `}
            onClick={() => {
              readOnlyInputId.value = id;
            }}
          >
            {rightAdornment}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
