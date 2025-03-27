/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Add global type definitions
interface Window {
  API_URL?: string;
  MED_MATCH_CONFIG?: {
    apiUrl?: string;
    [key: string]: any;
  };
} 