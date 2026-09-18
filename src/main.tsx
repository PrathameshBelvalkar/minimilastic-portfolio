import {StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

const root = document.getElementById('root')!;

hydrateRoot(
  root,
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
);
