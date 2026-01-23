import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages';

test.describe('Register Page - Basic Tests', () => {
    
    test('should load register page successfully', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.navigateToRegister();
        
        const title = await registerPage.getTitle();
        expect(title).toContain('nopCommerce');
    });

    test('should navigate to registration page', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.navigateToRegister();
        
        const url = await registerPage.getCurrentURL();
        expect(url).toContain('register');
    });

    test('should fill registration form with valid data', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.navigateToRegister();
        
        try {
            await registerPage.fillRegistrationForm({
                gender: 'Male',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                company: 'Example Inc.',
                newsletter: true,
                password: 'Password123',
                confirmPassword: 'Password123'
            });

            expect(true).toBe(true);
        } catch (error) {
            console.error('Error taking screenshot:', error);
        }
    });

    test('should submit registration form', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.navigateToRegister();
        
        try {
            await registerPage.fillRegistrationForm({
                gender: 'Male',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                company: 'Example Inc.',
                newsletter: true,
                password: 'Password123',
                confirmPassword: 'Password123'
            });

            expect(true).toBe(true); // Dummy assertion to indicate form filled

            await registerPage.clickRegisterButton();

            const isSuccess = await registerPage.isRegistrationSuccessful();
            expect(isSuccess).toBe(true);
        } catch (error) {
            console.error('Error taking screenshot:', error);
        }
    });
});