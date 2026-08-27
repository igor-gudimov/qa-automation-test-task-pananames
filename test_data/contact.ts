import { faker } from '@faker-js/faker';
import { type ContactObject } from '../page_objects/pages/create_new_contact_page';

/** Countries handed out one-by-one, in order, on each `generateContact()` call. */
const COUNTRIES = ['Ukraine', 'Andorra', 'Guyana', 'Bolivia', 'Ecuador'];
let countryIndex = 0;

/**
 * Builds a fresh, randomly generated contact on every call so each test works
 * with unique data. The `country` field rotates through `COUNTRIES` in order,
 * wrapping back to the start after the last one. Pass `overrides` to pin any
 * field to a known value.
 */
export function generateContact(
  overrides: Partial<ContactObject> = {},
): ContactObject {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const country = COUNTRIES[countryIndex];
  countryIndex = (countryIndex + 1) % COUNTRIES.length;

  return {
    contactType: firstName + lastName,
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phoneNumber: faker.string.numeric(9),
    country,
    ...overrides,
  };
}
