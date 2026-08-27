import { expect } from '@playwright/test';
import { test as setup } from "./pages_setup";
import path from 'path';

const adminUserAuthFile = path.join(__dirname, '../../playwright/.auth/admin_pananames_user.json');

setup('Admin user authentication', async ({ loginPage, domainsPage, page }) => {
  await loginPage.open();
  await loginPage.performLoginAction(process.env.EMAIL!, process.env.PASSWORD!);
  await page.waitForURL(domainsPage.url);
  await expect(domainsPage.domainSearchInput).toBeVisible();
  await page.context().storageState({ path: adminUserAuthFile });
  await page.close();
});