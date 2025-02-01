import '@testing-library/jest-dom';

// Mock Vite's import.meta
interface ImportMeta {
  env: {
    VITE_API_URL: string;
    [key: string]: string;
  };
}

declare global {
  interface Window {
    importMeta: ImportMeta;
  }
  var importMeta: ImportMeta;
}

global.importMeta = {
  env: {
    VITE_API_URL: 'http://localhost:3000',
    MODE: 'test'
  }
};
