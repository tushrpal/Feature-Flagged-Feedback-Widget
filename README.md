This project uses Jest for unit tests and Playwright for end-to-end tests.

1. Unit Tests (Jest)

Run all unit tests:

npm run test:unit

Run in watch mode (reruns on file changes):

npm run test:unit:watch

Generate coverage report:

npm run test:unit:coverage

The coverage report will appear in coverage/lcov-report/index.html.
You can open it in your browser:

open coverage/lcov-report/index.html

2. E2E Tests (Playwright)

Run all end-to-end tests:

npm run test:e2e

Run E2E tests in headed mode (see the browser as tests run):

npx playwright test --headed

Run a specific test file:

npx playwright test tests/e2e/widget.spec.ts
