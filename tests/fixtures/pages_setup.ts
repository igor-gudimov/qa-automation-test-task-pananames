import { test as baseTest } from "@playwright/test";
import { ContactsPage } from "../../page_objects/pages/contacts_page";
import { CreateNewContactPage } from "../../page_objects/pages/create_new_contact_page";
import { LoginPage } from "../../page_objects/pages/login_page";
import { DomainsPage } from "../../page_objects/pages/domains_page";
import { RegisterDomainsPage } from "../../page_objects/pages/register_domain_page";
import { ShoppingCartPage } from "../../page_objects/pages/shopping_cart_page";

type Pages = {
  contactsPage: ContactsPage;
  createNewContactPage: CreateNewContactPage;
  loginPage: LoginPage;
  domainsPage: DomainsPage;
  registerDomainsPage: RegisterDomainsPage;
  shoppingCartPage: ShoppingCartPage;
};

export const test = baseTest.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  domainsPage: async ({ page }, use) => {
    await use(new DomainsPage(page));
  },
  contactsPage: async ({ page }, use) => {
    await use(new ContactsPage(page));
  },
  createNewContactPage: async ({ page }, use) => {
    await use(new CreateNewContactPage(page));
  },
  registerDomainsPage: async ({ page }, use) => {
    await use(new RegisterDomainsPage(page));
  },
  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },
});