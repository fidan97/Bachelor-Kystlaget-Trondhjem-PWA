import { signal } from "@preact/signals-react";

const darkModeStatus = JSON.parse(localStorage.getItem("isDarkMode"));

export const isDarkMode = signal(darkModeStatus ?? false);
