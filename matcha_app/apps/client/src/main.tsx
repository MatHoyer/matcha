import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import { AlertDialogRenderer } from './components/dialogs/alert-dialog/AlertDialogRenderer';
import { GlobalDialog } from './components/dialogs/components/GlobalDialog';
import { ThemeProvider } from './components/theme/ThemeProvider';
import './index.css';
import { NotificationProvider } from './pages/notification/Notificationcontext';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalDialog />
        <AlertDialogRenderer />
        <Toaster />
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
