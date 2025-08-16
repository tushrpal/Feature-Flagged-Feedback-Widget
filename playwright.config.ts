import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: "http://localhost:5173", // or 3000 if Next.js
    headless: false,
  },
  webServer: {
    command: "npm run dev", // or "npm run start" if built
    port: 5173, // change if your dev server runs on 3000 etc.
    reuseExistingServer: !process.env.CI,
  },
});
