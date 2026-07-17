import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing.jsx";
import RondaApp from "./App.jsx";
import "./index.css";

function AppPage() {
  return (
    <div style={{ height: "100vh" }}>
      <RondaApp />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
