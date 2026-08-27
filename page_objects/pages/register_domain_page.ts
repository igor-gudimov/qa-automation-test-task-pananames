import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './base_page';
import { TopHeader } from '../components/top_header';

/** Name / period / price / action cell locators for a single search-results row. */
type DomainRowFields = {
  name: Locator;
  period: Locator;
  price: Locator;
  addToCart: Locator;
  whois: Locator;
};

export class RegisterDomainsPage extends BasePage {
  readonly page: Page;
  readonly topHeader: TopHeader;
  readonly domainSearchInput: Locator;
  readonly domainList: Locator;
  readonly domainRows: Locator;
  readonly availableDomainRows: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.url = '/register-domain';
    this.topHeader = new TopHeader(page);
    this.domainSearchInput = page.getByPlaceholder(
      'Enter domain name or keyword',
    );
    this.domainList = page.locator('.va-list[role="list"]', {
      has: page.locator('.domain-name'),
    });
    this.domainRows = this.domainList.getByRole('listitem');
    this.availableDomainRows = this.domainRows.filter({
      has: page.getByRole('button', { name: 'Add to cart' }),
    });
  }

  /** Name, period, price, "Add to cart" and "Whois" locators for a results-list row. */
  rowFields(row: Locator): DomainRowFields {
    return {
      name: row.locator('.domain-name'),
      period: row.getByRole('combobox'),
      price: row.locator('span.text-gray-900'),
      addToCart: row.getByRole('button', { name: 'Add to cart' }),
      whois: row.getByRole('button', { name: 'Whois' }),
    };
  }

  /** Cell locators for the first available (registrable) domain in the list. */
  firstAvailableDomainRowFields(): DomainRowFields {
    return this.rowFields(this.availableDomainRows.first());
  }

  async getfirstAvailableDomainWithListedPrice(topDomain: string) {
    await this.domainSearchInput.fill(topDomain);
    // await this.domainSearchInput.press('Enter');
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.url().includes(`/api/register-domain/${topDomain}/price`) &&
          response.status() === 200,
      ),
      await this.domainSearchInput.press('Enter'),
    ]);
    const firstAvailable = this.firstAvailableDomainRowFields();
    await expect(firstAvailable.addToCart).toBeVisible();
    const domainName = (await firstAvailable.name.innerText()).trim();
    const listedPrice = (await firstAvailable.price.innerText()).trim();
    await firstAvailable.addToCart.click();
    await this.topHeader.toastPopupCloseButton.click();
    return { domainName, listedPrice };
  }
}
