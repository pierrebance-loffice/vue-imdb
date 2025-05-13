import "@mdi/font/css/materialdesignicons.css";
import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/vue";
import { afterEach, expect } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
  ssr: false,
});

// Make Vuetify available globally
declare global {
  interface Window {
    vuetify: typeof vuetify;
  }
}

window.vuetify = vuetify;

// Extend Vitest's expect type
declare module "vitest" {
  interface Assertion {
    toBeInTheDocument(): void;
    toHaveAttribute(attr: string, value?: string): void;
  }
  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): void;
    toHaveAttribute(attr: string, value?: string): void;
  }
}

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});
