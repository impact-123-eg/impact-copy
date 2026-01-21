import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import GlobalState from "./context/GlobelContext.jsx";
import TanstackProvider from "./providers/TanstackProvider.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import { BrowserRouter as Router } from "react-router-dom";

AOS.init({ once: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TanstackProvider>
      <GlobalState>
        <AuthContextProvider>
          <Router>
            <App />
          </Router>
        </AuthContextProvider>
      </GlobalState>
    </TanstackProvider>
  </StrictMode>
);
