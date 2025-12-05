
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './src/i18n';
import { Suspense } from 'react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0F1115]" />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
