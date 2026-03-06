/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAIL_SERVICE: string;
  readonly VITE_EMAIL_TEMPLATE: string;
  readonly VITE_EMAIL_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
