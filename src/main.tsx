import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { AppRouter } from './router.tsx';
import './i18n';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
    <Analytics />
  </StrictMode>,
);
