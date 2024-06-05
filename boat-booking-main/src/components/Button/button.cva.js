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
          "bg-secondary",
          "focus:bg-[#8CB80E]",
          "hover:bg-[#8CB80E]",
          "disabled:bg-[#C4E565]",
          "disabled:pointer-events-none",
          "disabled:select-none",
          "focus-visible:outline-[#C4E565]",
          "text-white",
          "py-3 px-4 w-fit",
        ],
        teritary: [
          "bg-teritary",
          "focus:bg-[#AC007F]",
          "hover:bg-[#AC007F]",
          "disabled:bg-[#E359BF]",
          "disabled:pointer-events-none",
          "disabled:select-none",
          "focus-visible:outline-[#E359BF]",
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
