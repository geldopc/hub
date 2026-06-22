import { test, expect } from "@playwright/test";

test("renders navbar with hub title", async ({ page }) => {
  await page.goto("");
  await expect(page.locator("#navbar")).toBeVisible();
  await expect(page.locator("#navbar")).toContainText("hub");
});

test("renders home page", async ({ page }) => {
  await page.goto("");
  await expect(page.locator("#home")).toBeVisible();
});

test("theme toggle works", async ({ page }) => {
  await page.goto("");
  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);
  await page.locator("#theme-toggle").click();
  await expect(html).not.toHaveClass(/dark/);
});

test("task planner renders and adds a task", async ({ page }) => {
  await page.goto("");
  await expect(page.locator("#task-planner")).toBeVisible();

  const input = page.locator("#task-planner-input");
  await input.fill("Implement feature X");
  await input.press("Enter");

  await expect(page.locator("#task-planner-list")).toContainText("Implement feature X");
});

test("task planner play button starts timer", async ({ page }) => {
  await page.goto("");

  const input = page.locator("#task-planner-input");
  await input.fill("Timer task");
  await input.press("Enter");

  const taskCard = page.locator(".group").first();
  const playBtn = taskCard.locator("button[aria-label='Iniciar tarefa']");
  await playBtn.click();

  const pauseBtn = taskCard.locator("button[aria-label='Pausar tarefa']");
  await expect(pauseBtn).toBeVisible();
});
