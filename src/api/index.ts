// src/api/index.ts
import * as http from "./http";

// From now on everything uses the real backend API
export const API = {
  ...http,
};
