import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import './i18n';

export function render(url: string) {
  return renderToString(
    <ThemeProvider>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </ThemeProvider>,
  );
}
