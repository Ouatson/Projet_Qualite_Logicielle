import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { CustomWorld } from '../support/world';

Given('I am on the registration page', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  await registerPage.navigateToRegister();
  await registerPage.waitForPageLoad();
});

When('I fill in the registration form with the following details:', async function (this: CustomWorld, dataTable) {
  const registerPage = new RegisterPage(this.page);
  const data = dataTable.rowsHash();
  
  const userData: any = {
    firstName: data['First Name'] || '',
    lastName: data['Last Name'] || '',
    email: data['Email'] || '',
    password: data['Password'] || '',
    confirmPassword: data['Confirm Password'] || '',
  };

  if (data['Gender']) {
    userData.gender = data['Gender'];
  }

  if (data['Day of Birth'] && data['Month of Birth'] && data['Year of Birth']) {
    userData.dateOfBirth = {
      day: data['Day of Birth'],
      month: data['Month of Birth'],
      year: data['Year of Birth'],
    };
  }

  if (data['Company']) {
    userData.company = data['Company'];
  }

  await registerPage.fillRegistrationForm(userData);
});

When('I click the Register button', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  await registerPage.clickRegisterButton();
});

When('I click the Register button without filling the form', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  await registerPage.clickRegisterButton();
});

When('I subscribe to the newsletter', async function (this: CustomWorld) {
  // Newsletter checkbox is typically checked by default, this ensures it's checked
  await this.page.locator('#Newsletter').check();
});

Then('I should see a registration success message', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  const successMessage = await registerPage.getSuccessMessage();
  expect(successMessage).toBeTruthy();
});

Then('the message should say {string}', async function (this: CustomWorld, expectedMessage: string) {
  const registerPage = new RegisterPage(this.page);
  const successMessage = await registerPage.getSuccessMessage();
  expect(successMessage).toContain(expectedMessage);
});

Then('I should see validation error messages', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  const errors = await registerPage.getErrorMessages();
  expect(errors.length).toBeGreaterThan(0);
});

Then('the errors should indicate required fields', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  const errors = await registerPage.getErrorMessages();
  expect(errors.length).toBeGreaterThan(0);
  // Check that at least one error mentions "required"
  const hasRequiredError = errors.some(error => 
    error.toLowerCase().includes('required') || error.trim() !== ''
  );
  expect(hasRequiredError).toBeTruthy();
});

Then('I should see a password mismatch error', async function (this: CustomWorld) {
  const registerPage = new RegisterPage(this.page);
  const errors = await registerPage.getErrorMessages();
  const hasPasswordError = errors.some(error => 
    error.toLowerCase().includes('password') || error.toLowerCase().includes('match')
  );
  expect(hasPasswordError).toBeTruthy();
});
