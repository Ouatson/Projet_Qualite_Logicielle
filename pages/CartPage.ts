import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object
 * Represents a cart detail page
 */

export class CartPage extends BasePage {
    // Locators
    private readonly cartItems: Locator;
    private readonly checkoutButton: Locator;
    private readonly updateCartButton: Locator;
    private readonly cartTotal: Locator;
    private readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItems = page.locator('.cart-item');
        this.checkoutButton = page.locator('.checkout-button');
        this.updateCartButton = page.locator('.update-cart-button');
        this.cartTotal = page.locator('.cart-total');
        this.emptyCartMessage = page.locator('.empty-cart-message');
    }

    /**
     * Get number of items in the cart
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    /**
     * Get cart items
     */
    async getCartItems(): Promise<string[]> {
        const items = await this.cartItems.allTextContents();
        return items.map(item => item.trim());
    }

    /**
     * Get cart total price
     */
    async getCartTotal(): Promise<string | null> {
        return await this.cartTotal.textContent();
    }

    /**
     * Proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    /**
     * Update cart
     */
    async updateCart(): Promise<void> {
        await this.updateCartButton.click();
    }

    /**
     * Check if cart is empty
     */
    async isCartEmpty(): Promise<boolean> {
        return await this.emptyCartMessage.isVisible();
    }
}