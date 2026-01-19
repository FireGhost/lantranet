import { test, expect } from '@playwright/test';

test('admin can login and logout', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('badpassword');

  await page.getByRole('button', { name: 'Login' }).click();
  
  await expect(page.getByRole('alert')).toContainText('Bad credentials');

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('adminadmin');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Animations' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buvette' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();
});

test('user can login and logout', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('user');

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('useruser');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Animations' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buvette' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  
  await expect(page.getByRole('link', { name: 'Admin', exact: true })).toBeHidden();

  await page.getByRole('button', { name: 'Logout' }).click();
});
