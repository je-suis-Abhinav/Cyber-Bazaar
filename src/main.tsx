import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import './styles/variables.css';
import './styles/index.css';
import './styles/navbar.css';
import './styles/storefront.css';
import './styles/dashboard.css';
import './styles/admin.css';
import './styles/components.css';
import './styles/login.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(8, 14, 35, 0.95)',
                color: '#fff',
                border: '1px solid rgba(0,255,255,0.18)',
                borderRadius: '16px',
                backdropFilter: 'blur(12px)',
                padding: '14px 18px',
                boxShadow:
                  '0 10px 30px rgba(0,0,0,0.35), 0 0 18px rgba(0,255,255,0.08)',
              },

              success: {
                iconTheme: {
                  primary: '#00f2fe',
                  secondary: '#081223',
                },
              },

              error: {
                iconTheme: {
                  primary: '#ff4d6d',
                  secondary: '#081223',
                },
              },
            }}
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
