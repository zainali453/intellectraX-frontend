/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API_URL: string;
  readonly VITE_APP_PROD: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.png";
declare module "*.svg";
declare module "*.jpg";
declare module "*.jpeg";
