import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeareHouseProvider } from './WeareHouse/WeareHouseContext.jsx';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <WeareHouseProvider>
          <App />
        </WeareHouseProvider>
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
)
