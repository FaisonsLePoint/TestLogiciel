import { defineConfig } from "cypress";
// Pour les anciennes versions cypress
// import * as ccModule from '@cypress/code-coverage/task.js'
// const registerCodeCoverageTasks = ccModule.default


import coverageTask from '@cypress/code-coverage/task'

export default defineConfig({
  video: true,
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Pour les anciennes versions
      // registerCodeCoverageTasks(on, config)
      // return config    

      coverageTask(on, config)
      return config 
    },
  },
  env: {
    codeCoverage: {
      exclude: ['cypress/**/*.*'],
    },
  }
});
