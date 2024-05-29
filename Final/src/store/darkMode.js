// src/store/darkMode.js

import { signal } from "@preact/signals-react";

const storedDarkModeStatus = localStorage.getItem("isDarkMode");
const darkModeStatus = storedDarkModeStatus ? JSON.parse(storedDarkModeStatus) : false;

export const isDarkMode = signal(darkModeStatus);
