import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Chat from './Chat.tsx';
import { ThemeProvider } from './components/theme/ThemeProvider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="h-dvh w-full">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Chat />
      </ThemeProvider>
    </main>
  </StrictMode>
);
