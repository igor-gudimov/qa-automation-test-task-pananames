import { expect } from '@playwright/test';
import { test } from './fixtures/pages_setup';

test.describe.configure({ mode: 'default' });

test.use({ storageState: 'playwright/.auth/admin_pananames_user.json' });

test.beforeEach(async ({ registerDomainsPage, shoppingCartPage }, testInfo) => {
  console.log(`${testInfo.title}`);
  await shoppingCartPage.open();
  try {
    // Wait for the element to become visible, capping the wait at 5 seconds
    await shoppingCartPage
      .cartRowFields(0)
      .domain.waitFor({ state: 'visible', timeout: 5000 });
    await shoppingCartPage.clearCart();
    await expect(shoppingCartPage.cartRowFields(0).domain).toBeHidden();
  } catch (error) {}
  await registerDomainsPage.open();
});

test.afterEach(async ({ page }) => {
  await page.close();
});

[{ domain: 'ua' }, { domain: 'uk' }, { domain: 'us' }].forEach(
  ({ domain }) => {
    test(`Domain price - ${domain}`, async ({
      registerDomainsPage,
      shoppingCartPage,
    }) => {
      const firstItem =
        registerDomainsPage.getfirstAvailableDomainWithListedPrice(`${domain}`);

      await registerDomainsPage.topHeader.cartIcon.click();
      await expect(shoppingCartPage.cartRowFields(0).domain).toHaveText(
        (await firstItem).domainName,
      );
      await expect(shoppingCartPage.cartRowFields(0).totalCost).toHaveText(
        (await firstItem).listedPrice,
      );
      await expect(shoppingCartPage.totalPrice).toContainText(
        (await firstItem).listedPrice,
      );
    });
  },
);

test('Domain price for 3 SLD items', async ({
  registerDomainsPage,
  shoppingCartPage,
}) => {
  const firstSLDItem =
    await registerDomainsPage.getfirstAvailableDomainWithListedPrice('catering');
  const secondSLDItem =
    await registerDomainsPage.getfirstAvailableDomainWithListedPrice('associates');
  const thirdSLDItem =
    await registerDomainsPage.getfirstAvailableDomainWithListedPrice('apartments');

  await registerDomainsPage.topHeader.cartIcon.click();
  await expect(shoppingCartPage.cartRowFields(0).domain).toHaveText(
    (await firstSLDItem).domainName,
  );
  await expect(shoppingCartPage.cartRowFields(1).domain).toHaveText(
    (await secondSLDItem).domainName,
  );
  await expect(shoppingCartPage.cartRowFields(2).domain).toHaveText(
    (await thirdSLDItem).domainName,
  );

  const firstSLDPrice = await shoppingCartPage.cartRowFields(0).totalCost.textContent()
  const secondSLDPrice = await shoppingCartPage.cartRowFields(1).totalCost.textContent()
  const thirdSLDPrice = await shoppingCartPage.cartRowFields(2).totalCost.textContent()
  // Strip currency symbol / thousands separators (e.g. "$1,106.14" -> 1106.14).
  const toPrice = (text: string | null) =>
    parseFloat((text ?? '').replace(/[^0-9.]/g, ''));
  const sumOfThreeSLDItems =
    toPrice(firstSLDPrice) +
    toPrice(secondSLDPrice) +
    toPrice(thirdSLDPrice);
  const totalPriceText = await shoppingCartPage.totalPrice.textContent()
  expect(toPrice(totalPriceText)).toEqual(Number(sumOfThreeSLDItems.toFixed(2)));
});