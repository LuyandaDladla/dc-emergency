import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./styles/theme.css";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { ProvinceProvider } from "./context/ProvinceContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ProvinceProvider>
                    <App />
                </ProvinceProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
