import { signal } from "@preact/signals-react";
export const languages = [
  { label: "English", value: "en", image: "/images/uk-flag.jpg" },
  {
    label: "Norwegian",
    value: "no",
    image: "/images/norway-flag.png",
  },
];
const lang = JSON.parse(localStorage.getItem("lang"));

export const langMode = signal(lang ?? languages[0]);
