import { test, expect } from "@playwright/test";

test("landing page renders hero and features", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#features")).toBeVisible();
});

test("FAQ accordion opens", async ({ page }) => {
  await page.goto("/#faq");
  const firstQuestion = page.getByRole("button").filter({ hasText: "Нужен ли платный Cursor?" });
  await firstQuestion.click();
  await expect(page.getByText("Для Agent и MCP нужна подписка Cursor")).toBeVisible();
});
