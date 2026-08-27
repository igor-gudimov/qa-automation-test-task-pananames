import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base_page';
import { TopHeader } from '../components/top_header';

export class DomainsPage extends BasePage {
  readonly page: Page;
  readonly topHeader: TopHeader;
  readonly domainSearchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.url = '/domains';
    this.topHeader = new TopHeader(page);
    this.domainSearchInput = page.getByPlaceholder('Enter domain name or keyword');
  }
}