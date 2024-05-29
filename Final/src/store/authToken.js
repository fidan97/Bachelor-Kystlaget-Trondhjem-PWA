import { signal } from "@preact/signals-react";

const tokenStatus = localStorage.getItem("token");
const token = tokenStatus ? JSON.parse(tokenStatus) : false;

export const authToken = signal(token ?? null);
