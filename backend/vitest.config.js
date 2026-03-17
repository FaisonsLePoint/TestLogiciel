const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
    test: {
        globals: true,
        environment: 'node',
        pool: 'forks',
        include: ['test_vitest/****.test.{mjs,js,ts}'],
        setupFiles: ['dotenv/config']
    }
})