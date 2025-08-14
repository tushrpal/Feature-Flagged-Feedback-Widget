Project: Feature-Flagged Feedback Widget


Build a small, embeddable feedback widget that supports multiple display modes, persists draft state offline, and is fully tested at the unit & E2E level.


---

Functional Requirements

1. Widget Display Modes

Compact icon-only button (bottom-right corner of screen).

Expanded panel with form fields.

Full-page mode (for mobile or embedding in a standalone page).



2. Form Features

Fields: Name (optional), Email (optional), Message (required), Category (dropdown: Bug, Feature, Other).

Character counter for message (max 500 chars).

Async submit (mock API call with 500–1500ms delay).

Success & error states with retry option.



3. Draft Persistence

Save form state to localStorage on every change.

Restore draft when reopening the widget.



4. Feature Flags

Toggle features like "Email field required" or "Dark mode" via a feature flag context.

Flags fetched from a mock API at app start.



5. Accessibility

Keyboard navigable.

Screen reader labels for all inputs.

Focus trap in expanded panel.





---

Testing Requirements

Unit & Component Testing (Jest / Vitest + React Testing Library)

Form validation logic (required fields, max length).

Draft persistence (mock localStorage).

Feature flag context behavior.

State changes: collapsed → expanded → submitted.

Success & error message rendering.


E2E Testing (Playwright / Cypress)

Load widget, open form, fill and submit successfully.

Simulate API error → retry flow works.

Draft persistence across reload.

Feature flag changes affect UI (e.g., email required).

Keyboard navigation & focus trap checks.



---

Acceptance Criteria

Unit tests: ≥90% coverage for components and hooks.

E2E tests: Pass on Chrome and Firefox.

Form can be submitted successfully and error handling works.

Draft state restored after reload.

Accessible (axe checks pass in tests).



---

Deliverables

React + TypeScript app (could be CRA, Vite, or Next.js).

Testing setup for unit + E2E.

Mock API server for flags and submit (msw or similar).

README with test commands and coverage report screenshot.


