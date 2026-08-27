import { type Locator, type Page } from '@playwright/test';
import { BaseComponent } from '../components/base_component';

export class TopHeader extends BaseComponent {
  readonly page: Page;
  readonly profileMenu: Locator;
  readonly balanceMenu: Locator;
  readonly contactsButton: Locator;
  readonly cartIcon: Locator;
  readonly cartItemsCount: Locator;
  readonly toastPopupCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.profileMenu = page.locator('#acc-menu > div:not(#client-menu)');
    this.balanceMenu = page.locator('#client-menu');
    this.contactsButton = this.balanceMenu.locator('td.va-menu-item__cell', { hasText: 'Contacts' });
    this.cartIcon = page.locator('#acc-menu div.cursor-pointer', {
      has: page.locator('svg[width="20"][height="20"]'),
    });
    this.cartItemsCount = this.cartIcon.locator('div.rounded-full');
    this.toastPopupCloseButton = page.locator('i.va-toast__close-icon');
  }
}
