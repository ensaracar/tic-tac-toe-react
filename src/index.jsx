import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/scss/theme.scss';
import Game from './components/Game';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Game />
  </StrictMode>
);
