import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base_page';
import { TopHeader } from '../components/top_header';
import { ContactsPage } from './contacts_page';
import { expect } from '@playwright/test';

/** Data model for a contact created through the "Create new contact" form. */
export type ContactObject = {
  contactType: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
  comment?: string;
  promotionalEmails?: boolean;
  productEmails?: boolean;
  financialEmails?: boolean;
};

export class CreateNewContactPage extends BasePage {
  readonly page: Page;
  readonly topHeader: TopHeader;
  readonly createContactForm: Locator;
  readonly contactTypeNameField: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly phonePrefixField: Locator;
  readonly phonePrefixFieldText: Locator;
  readonly phonePrefixDropdown: Locator;
  readonly phonePrefixOptions: Locator;
  readonly phoneNumberField: Locator;
  readonly commentField: Locator;
  readonly promotionalEmailsCheckbox: Locator;
  readonly productEmailsCheckbox: Locator;
  readonly financialEmailsCheckbox: Locator;
  readonly createButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.url = '/contacts';
    this.topHeader = new TopHeader(page);

    this.createContactForm = page.locator('form');
    this.contactTypeNameField = this.createContactForm
      .locator('div.relative', { hasText: 'Contact type/NAME' })
      .locator('input');
    this.firstNameField = this.createContactForm
      .locator('div.relative', { hasText: 'First Name' })
      .locator('input');
    this.lastNameField = this.createContactForm
      .locator('div.relative', { hasText: 'Last Name' })
      .locator('input');
    this.emailField = this.createContactForm
      .locator('div.relative', { hasText: 'Email' })
      .locator('input');
    this.phonePrefixField = this.createContactForm.locator(
      'input.country-intl-input',
    );
    this.phonePrefixFieldText = this.createContactForm.locator(
      'span.country-intl-label-text',
    );
    this.phonePrefixDropdown = page.locator('.vue-country-list-wrap');
    this.phonePrefixOptions = this.phonePrefixDropdown.locator(
      'li.vue-country-item',
    );
    this.phoneNumberField = this.createContactForm
      .locator('div.relative', { hasText: 'Phone number' })
      .locator('input');
    this.commentField = this.createContactForm
      .locator('div.relative', { hasText: 'Comment (optional)' })
      .locator('input');
    this.promotionalEmailsCheckbox = this.createContactForm.getByLabel(
      'Send promotional emails (usually once a month)',
    );
    this.productEmailsCheckbox = this.createContactForm.getByLabel(
      'Send product emails (domain registrations, renewals, failures, etc.)',
    );
    this.financialEmailsCheckbox = this.createContactForm.getByLabel(
      'Send financial emails (balance notifications)',
    );
    this.createButton = this.createContactForm.getByRole('button', {
      name: 'Create',
    });
    this.saveButton = this.createContactForm.getByRole('button', {
      name: 'Save',
    });
  }

  phonePrefixOption(iso: string): Locator {
    return this.phonePrefixDropdown.locator(
      `li.vue-country-item[data-iso="${iso}"]`,
    );
  }

  phonePrefixOptionByName(name: string): Locator {
    return this.phonePrefixOptions.filter({ hasText: name });
  }

  async enterContactInfo(contact: ContactObject) {
    await this.contactTypeNameField.clear({force: true});
    await expect(this.contactTypeNameField).toBeEmpty();
    await this.contactTypeNameField.pressSequentially(contact.contactType);
    await this.firstNameField.clear({force: true});
    await this.firstNameField.pressSequentially(contact.firstName);
    await this.lastNameField.clear({force: true});
    await this.lastNameField.pressSequentially(contact.lastName);
    await this.emailField.clear({force: true});
    await this.emailField.pressSequentially(contact.email);
    await this.phonePrefixField.click({force: true});
    await this.phonePrefixOptionByName(contact.country).click();
    await this.phoneNumberField.clear({force: true});
    await this.phoneNumberField.pressSequentially(contact.phoneNumber);

    if (contact.comment !== undefined) {
      await this.commentField.clear({force: true});
      await this.commentField.pressSequentially(contact.comment);
    }
    if (contact.promotionalEmails !== undefined) {
      await this.promotionalEmailsCheckbox.setChecked(contact.promotionalEmails, {force: true});
    }
    if (contact.productEmails !== undefined) {
      await this.productEmailsCheckbox.setChecked(contact.productEmails, {force: true});
    }
    if (contact.financialEmails !== undefined) {
      await this.financialEmailsCheckbox.setChecked(contact.financialEmails, {force: true});
    }
  }

  async createNewContact(contact: ContactObject) {
    await new ContactsPage(this.page).addNewContactButton.click();
    await this.enterContactInfo(contact);
    await this.createButton.click();
  }

  async editContact(contact: ContactObject) {
    await this.enterContactInfo(contact);
    await this.saveButton.click();
  }

}
