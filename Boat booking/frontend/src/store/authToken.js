import { signal } from "@preact/signals-react";

const token = JSON.parse(localStorage.getItem("token"));

export const authToken = signal(token ?? null);
