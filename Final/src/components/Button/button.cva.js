import { cva } from "class-variance-authority";

const button = cva(
  "inline-flex justify-center rounded-md text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary: [
          "bg-primary-600",
          "focus:bg-primary-800",
          "hover:bg-primary-800",
          "disabled:bg-primary-500",
          "disabled:pointer-events-none",
          "disabled:select-none",
          "focus-visible:outline-primary-800",
          "text-white",
          "py-3 px-4 w-fit",
        ],
        secondary: [
          "bg-secondary-400",
          "focus:bg-secondary-600",
          "hover:bg-secondary-600",
          "disabled:bg-secondary-500",
          "disabled:pointer-events-none",
          "disabled:select-none",
          "focus-visible:outline-secondary-800",
          "text-white",
          "py-3 px-4 w-fit",
        ],
        teritary: [
          "bg-teritary-700",
          "focus:bg-teritary-800",
          "hover:bg-teritary-800",
          "disabled:bg-teritary-500",
          "disabled:pointer-events-none",
          "disabled:select-none",
          "focus-visible:outline-teritary-800",
          "text-white",
          "py-3 px-4 w-fit",
        ],
        danger: [
          "bg-danger-600",
          "focus:bg-danger-600",
          "hover:bg-danger-600",
          "disabled:bg-danger-300",
          "focus-visible:outline-danger-600",
          "text-white",
          "py-3 px-4 w-fit",
        ],
        icon: ["p-2 !shadow-none"],
        "icon-active": [
          "text-white",
          "fill-white",
          "p-2 w-max items-center justify-center flex",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export default button;
