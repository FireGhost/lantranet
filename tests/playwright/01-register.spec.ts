import { test, expect } from '@playwright/test';

test('can register user and first user is admin', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Register' }).click();

  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');

  await page.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('adminadmin');

  await page.getByRole('textbox', { name: 'Password confirmation' }).click();
  await page.getByRole('textbox', { name: 'Password confirmation' }).fill('somethingelse');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('#v-0-0-3-error')).toContainText('Passwords are not identical');

  await page.getByRole('textbox', { name: 'Password confirmation' }).click();
  await page.getByRole('textbox', { name: 'Password confirmation' }).fill('adminadmin');

  await page.locator('#v-0-0-3-error').waitFor({state: "hidden"});

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByRole('link', { name: 'Animations' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buvette' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();
});

test('second registered user is not admin', async ({ page }) => {
  await page.goto('/register');

  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('user');

  await page.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('useruser');

  await page.getByRole('textbox', { name: 'Password confirmation' }).click();
  await page.getByRole('textbox', { name: 'Password confirmation' }).fill('useruser');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByRole('link', { name: 'Animations' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buvette' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin', exact: true })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});
