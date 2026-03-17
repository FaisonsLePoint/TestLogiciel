const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
    test: {
        globals: true,
        environment: 'node',
        pool: 'forks',
        include: ['test_vitest/**/*.test.{mjs,js,ts}'],
        setupFiles: ['dotenv/config'],
        coverage: {
            provider: 'v8',            // ← v8 à la place d'istanbul
            include: ['api/**/*.js'],
            exclude: ['api/db.config.js', 'api/config'],
            thresholds: {
                statements: 80,
                branches: 70,
                functions: 80,
                lines: 80,
            }
        }
    }
})