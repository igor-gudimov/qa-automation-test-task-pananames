import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './base_page';
import { TopHeader } from '../components/top_header';

/** Item name / price / total cost / delete cell locators for a single cart-table row. */
type CartRowFields = {
  name: Locator;
  domain: Locator;
  price: Locator;
  totalCost: Locator;
  delete: Locator;
};

export class ShoppingCartPage extends BasePage {
  readonly page: Page;
  readonly topHeader: TopHeader;
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly cartSummary: Locator;
  readonly subtotal: Locator;
  readonly fee: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.url = '/cart';
    this.topHeader = new TopHeader(page);
    this.cartTable = page.locator('table.va-data-table__table');
    this.cartRows = this.cartTable.locator('tbody.va-data-table__table-tbody tr.va-data-table__table-tr');
    this.cartSummary = page.locator('div.flex-none.text-right.flex-col');
    this.subtotal = this.cartSummary.getByText(/^Subtotal:\s*\$/);
    this.fee = this.cartSummary.locator('div', { hasText: /^Fee:/ });
    this.totalPrice = this.cartSummary.getByText(/^TOTAL:\s*\$/);
  }

  /** Row `<tr>` of the cart table, matched by full domain name (e.g. `ua.academy`) or by 0-based index. */
  cartRow(domain: string | number): Locator {
    return typeof domain === 'number'
      ? this.cartRows.nth(domain)
      : this.cartRows.filter({
          has: this.page.getByText(domain, { exact: true }),
        });
  }

  /** Item name, domain, price, total cost and delete locators for the given cart row. */
  cartRowFields(domain: string | number): CartRowFields {
    const cells = this.cartRow(domain).locator('td.va-data-table__table-td');
    return {
      name: cells.nth(0),                       // "Register  ua.academy"
      domain: cells.nth(0).locator('span'),     // "ua.academy"
      price: cells.nth(5),                      // "$106.14"
      totalCost: cells.nth(6),                  // "$106.14"
      delete: cells.last().getByRole('button'),
    };
  }

  /** Removes every item from the cart, one row at a time, until the cart is empty. */
  async clearCart(): Promise<void> {
    for (let remaining = await this.cartRows.count(); remaining > 0; remaining--) {
      await this.cartRows
        .first()
        .locator('td.va-data-table__table-td')
        .last()
        .getByRole('button')
        .click();
      await expect(this.cartRows).toHaveCount(remaining - 1);
    }
  }
}
