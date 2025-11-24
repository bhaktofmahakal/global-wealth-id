import { test, expect } from '@playwright/test';

test('should convert credit score and display result', async ({ page }) => {
  await page.goto('/');

  await page.fill('input[name="score"]', '700');
  await page.selectOption('select[name="fromCountry"]', 'USA');
  await page.selectOption('select[name="toCountry"]', 'UK');
  await page.fill('input[name="user"]', 'TestUser');

  await page.click('button[type="submit"]');

  await expect(page.locator('text=Converted Score')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=From USA: 700 → To UK:')).toBeVisible();
  await expect(page.locator('text=TestUser')).toBeVisible();
});

test('should display form with all fields', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('text=Convert Credit Score')).toBeVisible();
  await expect(page.locator('input[name="score"]')).toBeVisible();
  await expect(page.locator('select[name="fromCountry"]')).toBeVisible();
  await expect(page.locator('select[name="toCountry"]')).toBeVisible();
  await expect(page.locator('input[name="user"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('should show Recent Checks heading', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('text=Recent Checks')).toBeVisible();
});

test('should handle form with different countries', async ({ page }) => {
  await page.goto('/');

  await page.fill('input[name="score"]', '650');
  await page.selectOption('select[name="fromCountry"]', 'Germany');
  await page.selectOption('select[name="toCountry"]', 'Japan');
  await page.fill('input[name="user"]', 'TestUser2');

  await page.click('button[type="submit"]');

  await expect(page.locator('text=Converted Score')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=From Germany: 650 → To Japan:')).toBeVisible();
  await expect(page.locator('text=TestUser2')).toBeVisible();
});

test('should handle optional user name field', async ({ page }) => {
  await page.goto('/');

  await page.fill('input[name="score"]', '725');
  await page.selectOption('select[name="fromCountry"]', 'USA');
  await page.selectOption('select[name="toCountry"]', 'UK');

  await page.click('button[type="submit"]');

  await expect(page.locator('text=Converted Score')).toBeVisible({ timeout: 5000 });
});
