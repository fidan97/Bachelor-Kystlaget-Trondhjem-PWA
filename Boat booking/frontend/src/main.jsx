import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import enTranslate from "../src/utils/translation/en/language.json";
import noTranslate from "../src/utils/translation/no/language.json";
import { langMode } from "./store/langMode.js";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("offline ready");
  },
});

i18next.init({
  lng: langMode.value?.value, // Set the initial language of the App
  resources: {
    en: {
      translation: enTranslate,
    },
    no: {
      translation: noTranslate,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <I18nextProvider i18n={i18next}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </I18nextProvider>
);
