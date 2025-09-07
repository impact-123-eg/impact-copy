import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import GlobalState from "./context/GlobelContext";
import TanstackProvider from "./providers/TanstackProvider.jsx";
import AuthContextProvider from "./context/AuthContext";

AOS.init({ once: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TanstackProvider>
      <GlobalState>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </GlobalState>
    </TanstackProvider>
  </StrictMode>
);
