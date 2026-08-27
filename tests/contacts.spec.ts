import { expect } from '@playwright/test';
import { test } from './fixtures/pages_setup';
import { generateContact } from '../test_data/contact';

test.describe.configure({ mode: 'default' });

test.use({ storageState: 'playwright/.auth/admin_pananames_user.json' });

test.beforeEach(async ({ contactsPage }, testInfo) => {
  console.log(`${testInfo.title}`)
  await contactsPage.open();
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test('Create new contact', async ({ contactsPage, createNewContactPage }) => {
  const contact = generateContact();
  await createNewContactPage.createNewContact(contact);

  const lastRow = contactsPage.contactRowFields(-1);
  await expect(lastRow.contacts).toHaveText(contact.email);
  await lastRow.edit.click();
  await expect(createNewContactPage.contactTypeNameField).toHaveValue(contact.contactType);
  await expect(createNewContactPage.firstNameField).toHaveValue(contact.firstName);
  await expect(createNewContactPage.lastNameField).toHaveValue(contact.lastName);
  await expect(createNewContactPage.emailField).toHaveValue(contact.email);
  await expect(createNewContactPage.phonePrefixFieldText).toContainText(contact.country);
  await expect(createNewContactPage.phoneNumberField).toHaveValue(contact.phoneNumber);
  await expect(createNewContactPage.commentField).toBeEmpty();
  await expect(createNewContactPage.promotionalEmailsCheckbox).toBeChecked({checked: true})
  await expect(createNewContactPage.productEmailsCheckbox).toBeChecked({checked: false})
  await expect(createNewContactPage.financialEmailsCheckbox).toBeChecked({checked: false})
});

test('Edit contact', async ({ contactsPage, createNewContactPage, page }) => {
  const contact = await generateContact();
  const newContact = await generateContact();
  newContact.comment = "Test comment"
  newContact.promotionalEmails = false
  newContact.productEmails = true
  newContact.financialEmails = true
  await createNewContactPage.createNewContact(contact);
  const lastRow = await contactsPage.contactRowFields(-1);
  await expect(lastRow.contacts).toHaveText(contact.email);
  
  await page.reload()
  await lastRow.edit.click();
  await page.reload()
  await page.waitForTimeout(500);
  await createNewContactPage.editContact(newContact);
  await expect(lastRow.contacts).toHaveText(newContact.email);
  await lastRow.edit.click();
  await expect(createNewContactPage.contactTypeNameField).toHaveValue(newContact.contactType);
  await expect(createNewContactPage.firstNameField).toHaveValue(newContact.firstName);
  await expect(createNewContactPage.lastNameField).toHaveValue(newContact.lastName);
  await expect(createNewContactPage.emailField).toHaveValue(newContact.email);
  await expect(createNewContactPage.phonePrefixFieldText).toContainText(newContact.country);
  await expect(createNewContactPage.phoneNumberField).toHaveValue(newContact.phoneNumber);
  await expect(createNewContactPage.commentField).toHaveValue(newContact.comment);
  await expect(createNewContactPage.promotionalEmailsCheckbox).toBeChecked({checked: false})
  await expect(createNewContactPage.productEmailsCheckbox).toBeChecked({checked: true})
  await expect(createNewContactPage.financialEmailsCheckbox).toBeChecked({checked: true})
});

test('Delete contact', async ({ contactsPage, createNewContactPage, page }) => {
  const contact = await generateContact();
  await createNewContactPage.createNewContact(contact);
  const lastRow = await contactsPage.contactRowFields(-1);
  await expect(lastRow.contacts).toHaveText(contact.email);
  
  await page.reload()
  await lastRow.delete.click();
  await contactsPage.deletePopupOkButton.click();
  await page.reload()
  await expect(lastRow.contacts).not.toHaveText(contact.email);
});