import React from "react"
import { createRoot } from "react-dom/client";
import { RecoilRoot } from 'recoil';
const root = createRoot(document.getElementById("root"));
import App from "./components/App.jsx"

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);