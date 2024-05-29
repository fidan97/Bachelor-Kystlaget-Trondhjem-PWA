import { signal } from "@preact/signals-react";

const lang = JSON.parse(localStorage.getItem("lang"));

export const langMode = signal(lang ?? "en");
