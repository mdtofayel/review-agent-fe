import * as http from "./http";
import * as mock from "./mock";
const useMocks = String(import.meta.env.VITE_USE_MOCKS || "true") === "true";
export const API = useMocks ? mock : http;
// Usage: API.getFeaturedProducts(...)
