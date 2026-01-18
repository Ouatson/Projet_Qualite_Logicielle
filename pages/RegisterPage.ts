import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Register Page Object
 * Represents the registration page of the nopCommerce demo site
 */
export class RegisterPage extends BasePage {
  // Locators
  private readonly genderMaleRadio: Locator;
  private readonly genderFemaleRadio: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly dateOfBirthDay: Locator;
  private readonly dateOfBirthMonth: Locator;
  private readonly dateOfBirthYear: Locator;
  private readonly emailInput: Locator;
  private readonly companyInput: Locator;
  private readonly newsletterCheckbox: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessages: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.genderMaleRadio = page.locator('#gender-male');
    this.genderFemaleRadio = page.locator('#gender-female');
    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.dateOfBirthDay = page.locator('select[name="DateOfBirthDay"]');
    this.dateOfBirthMonth = page.locator('select[name="DateOfBirthMonth"]');
    this.dateOfBirthYear = page.locator('select[name="DateOfBirthYear"]');
    this.emailInput = page.locator('#Email');
    this.companyInput = page.locator('#Company');
    this.newsletterCheckbox = page.locator('#Newsletter');
    this.passwordInput = page.locator('#Password');
    this.confirmPasswordInput = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');
    this.successMessage = page.locator('.result');
    this.errorMessages = page.locator('.field-validation-error');
  }

  /**
   * Navigate to register page
   */
  async navigateToRegister(): Promise<void> {
    await this.navigate('/register');
  }

  /**
   * Fill registration form
   * @param userData - User registration data
   */
  async fillRegistrationForm(userData: {
    gender?: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    dateOfBirth?: { day: string; month: string; year: string };
    email: string;
    company?: string;
    newsletter?: boolean;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    if (userData.gender === 'Male') {
      await this.genderMaleRadio.check();
    } else if (userData.gender === 'Female') {
      await this.genderFemaleRadio.check();
    }

    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);

    if (userData.dateOfBirth) {
      await this.dateOfBirthDay.selectOption(userData.dateOfBirth.day);
      await this.dateOfBirthMonth.selectOption(userData.dateOfBirth.month);
      await this.dateOfBirthYear.selectOption(userData.dateOfBirth.year);
    }

    await this.emailInput.fill(userData.email);

    if (userData.company) {
      await this.companyInput.fill(userData.company);
    }

    if (userData.newsletter !== undefined) {
      if (userData.newsletter) {
        await this.newsletterCheckbox.check();
      } else {
        await this.newsletterCheckbox.uncheck();
      }
    }

    await this.passwordInput.fill(userData.password);
    await this.confirmPasswordInput.fill(userData.confirmPassword);
  }

  /**
   * Click register button
   */
  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  /**
   * Register a new user
   * @param userData - User registration data
   */
  async register(userData: {
    gender?: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    dateOfBirth?: { day: string; month: string; year: string };
    email: string;
    company?: string;
    newsletter?: boolean;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.fillRegistrationForm(userData);
    await this.clickRegisterButton();
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string | null> {
    if (await this.successMessage.isVisible({ timeout: 5000 })) {
      return await this.successMessage.textContent();
    }
    return null;
  }

  /**
   * Get error messages
   */
  async getErrorMessages(): Promise<string[]> {
    const errors = await this.errorMessages.allTextContents();
    return errors.filter(error => error.trim() !== '');
  }

  /**
   * Check if registration was successful
   */
  async isRegistrationSuccessful(): Promise<boolean> {
    const message = await this.getSuccessMessage();
    return message?.includes('Your registration completed') || false;
  }
}
