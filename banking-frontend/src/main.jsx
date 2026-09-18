import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

import "./assets/styles/global.css";
import "./assets/styles/sidebar.css";
import "./assets/styles/navbar.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <BrowserRouter>

            <AuthProvider>

                <App />

                 <ToastContainer
                     position="top-right"
                     autoClose={2500}
                />

            </AuthProvider>

        </BrowserRouter>

    </React.StrictMode>

);