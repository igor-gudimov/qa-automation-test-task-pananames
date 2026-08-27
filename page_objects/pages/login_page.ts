import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base_page';

export class LoginPage extends BasePage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.url = '/login';
    this.emailField = page.locator('input[name="email"]');
    this.passwordField = page.locator('input[name="password"]');
    this.loginButton = page
      .locator('form')
      .getByRole('button', { name: 'Login' });
  }

  async performLoginAction(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}
