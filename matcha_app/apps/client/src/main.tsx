import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import { ThemeProvider } from './components/theme/ThemeProvider';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <main className="h-dvh w-full">
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
