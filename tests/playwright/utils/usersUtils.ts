import type { Browser, BrowserContext, Page } from "@playwright/test";

let adminContext: BrowserContext|null = null;
let userContext: BrowserContext|null = null;

export async function getAdminPage(browser: Browser): Promise<Page> {
  if (!adminContext) {
    adminContext = await browser.newContext();
    const page = await adminContext.newPage();
    await doLoginOrRegister("admin", "adminadmin", page);
  }

  return adminContext.newPage();
}

export async function getUserPage(browser: Browser): Promise<Page> {
  if (!userContext) {
    userContext = await browser.newContext();
    const page = await userContext.newPage();
    await doLoginOrRegister("user", "useruser", page);
  }

  return userContext.newPage();
}

export async function setupBasicSettings(browser: Browser) {
  const adminPage = await getAdminPage(browser);

  await adminPage.goto('/admin');

  const dayOneValue = await adminPage.getByRole('textbox', { name: 'Lan day name' }).first().inputValue();
  if (dayOneValue === 'Day 1') {
    adminPage.close();
    return;
  }

  const lanDaysDiv = adminPage.getByText("Days of lan").locator('xpath=parent::div');
  await lanDaysDiv.locator('//input[not(@value)]').fill('Day 1');
  await lanDaysDiv.getByRole('button', { name: 'Add' }).click();
  
  await lanDaysDiv.locator('//input[@value=""]').fill('Day 2');
  await lanDaysDiv.getByRole('button', { name: 'Add' }).click();

  const menuCategoriesDiv = adminPage.getByText("Menu categories").locator('xpath=parent::div');
  await menuCategoriesDiv.locator('//input[not(@value)]').fill('Snacks');
  await menuCategoriesDiv.getByRole('button', { name: 'Add' }).click();

  await menuCategoriesDiv.locator('//input[@value=""]').fill('Drinks');
  await menuCategoriesDiv.getByRole('button', { name: 'Add' }).click();
  
  const orderStatusDiv = adminPage.getByText("Order status").locator('xpath=parent::div');
  await orderStatusDiv.locator('//input[not(@value)]').fill('Todo');
  await orderStatusDiv.getByRole('combobox').filter({ hasText: 'Select a color' }).click();
  await adminPage.getByRole('option', { name: 'warning' }).click();
  await orderStatusDiv.getByRole('button', { name: 'Add' }).click();

  await orderStatusDiv.locator('//input[@value=""]').fill('Done');
  await orderStatusDiv.getByRole('combobox').filter({ hasText: 'Select a color' }).click();
  await adminPage.getByRole('option', { name: 'error' }).click();
  await orderStatusDiv.getByRole('button', { name: 'Add' }).click();
  
  const appLocaleDiv = adminPage.getByText("App locale").locator('xpath=parent::div');
  await appLocaleDiv.getByRole('combobox').click();
  await adminPage.getByLabel('English').getByText('English').click();
  await appLocaleDiv.locator('//button[@type="submit"]').nth(0).click();
  
  await appLocaleDiv.getByRole('textbox', { name: 'Currency suffix' }).fill('BTC');
  await appLocaleDiv.locator('//button[@type="submit"]').nth(1).click();

  await appLocaleDiv.getByRole('textbox', { name: 'Datetime locale' }).fill('en-US');
  await appLocaleDiv.locator('//button[@type="submit"]').nth(2).click();

  await adminPage.close();
}

async function doLoginOrRegister(user: string, password: string, page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Username' }).fill(user);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  const alertTextContent = await page.getByRole('alert').textContent();
  if (alertTextContent !== 'You are logged in !') {
    await page.goto('/register');
    await page.getByRole('textbox', { name: 'Username' }).fill(user);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
    await page.getByRole('textbox', { name: 'Password confirmation' }).fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
  }
}
