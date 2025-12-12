// Manually define ImportMeta to support Vite's import.meta.glob and remove missing vite/client reference
interface ImportMeta {
  glob(pattern: string, options?: { as?: string; eager?: boolean; import?: string; query?: any }): Record<string, any>;
  readonly env: Record<string, string>;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}