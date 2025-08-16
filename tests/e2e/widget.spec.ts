import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Feedback Widget", () => {

  test("Widget loads and opens form", async ({ page }) => {
    await page.getByTestId("widget-button").click();
    await expect(page.getByTestId("feedback-form")).toBeVisible();
  });

  test("Submit flow (success)", async ({ page }) => {
    // Mock API before opening widget
    await page.route("**/feedback", route =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    );

    await page.getByTestId("widget-button").click();
    const form = page.getByTestId("feedback-form");
    await form.waitFor({ state: "visible" });
    await page.getByLabel("Email").fill("test@email.com");
    await page.getByLabel("Message").fill("Great app!");
    await page.getByRole("button", { name: /submit/i }).click();

  const successMessage = page.getByTestId("feedback-success");
await expect(successMessage).toBeVisible({ timeout: 15000 });
  });

  test("Submit flow (API error → retry works)", async ({ page }) => {
    let callCount = 0;
    await page.route("**/feedback", route => {
      callCount++;
      if (callCount === 1) route.fulfill({ status: 500, body: "Internal error" });
      else route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.getByTestId("widget-button").click();
    const form = page.getByTestId("feedback-form");
    await form.waitFor({ state: "visible" });

    await page.getByLabel("Email").fill("test@email.com");
    await page.getByLabel("Message").fill("First try failed");
    await page.getByRole("button", { name: /submit/i }).click();

   const errorMessage = page.locator('text=Something went wrong');
await expect(errorMessage).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /retry/i }).click();

    const successMessage = page.locator('text=Thank you for your feedback').first();
    await successMessage.waitFor({ state: 'visible', timeout: 10000 });
    await expect(successMessage).toBeVisible();
  });

  test("Draft persistence across reload", async ({ page }) => {
    await page.getByTestId("widget-button").click();
    await page.getByLabel("Message").fill("Persistent draft text");

    await page.reload();
    await page.getByTestId("widget-button").click();
    await expect(page.getByLabel("Message")).toHaveValue("Persistent draft text");
  });

  test("Feature flag changes affect UI (email required)", async ({ page }) => {
    await page.route("**/feature-flags", route =>
      route.fulfill({ status: 200, body: JSON.stringify({ emailRequired: false }) })
    );
    await page.reload();
    await page.getByTestId("widget-button").click();
    await expect(page.getByLabel("Email")).not.toHaveAttribute("required");

    await page.route("**/feature-flags", route =>
      route.fulfill({ status: 200, body: JSON.stringify({ emailRequired: true }) })
    );
    await page.reload();
    await page.getByTestId("widget-button").click();
    await expect(page.getByLabel("Email")).toHaveAttribute("required", "");
  });

  test("Keyboard navigation & focus trap", async ({ page }) => {
    await page.getByTestId("widget-button").click();
    const feedbackForm = page.getByTestId("feedback-form");
    await feedbackForm.waitFor({ state: "visible" });

    const feedbackField = page.getByLabel("Message");
    await feedbackField.waitFor({ state: "attached" });
    await feedbackField.focus(); // explicitly focus the textarea
    await expect(feedbackField).toBeFocused();

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const submitButton = page.getByRole("button", { name: /submit/i });
    await expect(submitButton).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(feedbackForm).not.toBeVisible();
  });
});
