/// <reference types="vite/client" />

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${baseUrl}${path}`;
};
