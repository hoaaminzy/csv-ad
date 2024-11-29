import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en";
import locale from "antd/es/locale/en_US";
import "antd/dist/reset.css";
import { BrowserRouter } from "react-router-dom";
import { auth } from "./config/FirebaseConfig";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ConfigProvider locale={locale} datePicker={{ locale: dayjs }}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ConfigProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
