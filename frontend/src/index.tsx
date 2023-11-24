import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/auth";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";
import { SearchContextProvider } from "./context/search";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <SearchContextProvider>
          <App />
          <Toaster />
        </SearchContextProvider>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>
);
