import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base_page';
import { TopHeader } from '../components/top_header';

/** Name / Contacts / Edit / Delete cell locators for a single contacts-table row. */
type ContactRowFields = {
  name: Locator;
  contacts: Locator;
  edit: Locator;
  delete: Locator;
};

export class ContactsPage extends BasePage {
  readonly page: Page;
  readonly topHeader: TopHeader;
  readonly addNewContactButton: Locator;
  readonly contactsTable: Locator;
  readonly contactRows: Locator;
  readonly deletePopupOkButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.url = '/contacts';
    this.topHeader = new TopHeader(page);
    this.addNewContactButton = page.getByRole('button', { name: '+ Add New Contact' });
    this.contactsTable = page.locator('table.va-data-table__table');
    this.contactRows = this.contactsTable.locator('tbody tr.va-data-table__table-tr');
    this.deletePopupOkButton = page.locator('button[va-child="okButton"]');
  }

  /** Row `<tr>` of the contacts table, matched by the Name cell text or by 0-based index. */
  contactRow(contact: string | number): Locator {
    return typeof contact === 'number'
      ? this.contactRows.nth(contact)
      : this.contactRows.filter({
          has: this.page.getByRole('cell', { name: contact, exact: true }),
        });
  }

  /** Name, Contacts, Edit and Delete locators for the given contact's row. */
  contactRowFields(contact: string | number): ContactRowFields {
    const cells = this.contactRow(contact).locator('td.va-data-table__table-td');
    return {
      name: cells.nth(0),
      contacts: cells.nth(1),
      edit: cells.nth(2).getByRole('button'),
      delete: cells.nth(3).getByRole('button'),
    };
  }
}
