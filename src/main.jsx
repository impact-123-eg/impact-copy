import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AOS from 'aos';
import 'aos/dist/aos.css';
import GlobalState from './context/GlobelContext';

AOS.init({ once: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalState>
    <App />
    </GlobalState>
  </StrictMode>
)
