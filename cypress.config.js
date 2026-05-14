import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '5ofv2v',
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
