import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./lib/init-select2";


import App from "./App.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import GlobalState from "./context/GlobelContext.jsx";
import TanstackProvider from "./providers/TanstackProvider.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

AOS.init({ once: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <TanstackProvider>
        <GlobalState>
          <AuthContextProvider>
            <Router>
              <App />
            </Router>
          </AuthContextProvider>
        </GlobalState>
      </TanstackProvider>
    </HelmetProvider>
  </StrictMode>
);
