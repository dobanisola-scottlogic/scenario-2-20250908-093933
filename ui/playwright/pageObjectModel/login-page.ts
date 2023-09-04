import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByPlaceholder("Username");
    this.passwordField = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", {name: "Login"})
    this.errorMessage = page.locator("class=error-message")
  }

  async inputUsername(username: string) {
    await this.usernameField.fill(username);
  }

  async inputPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async attemptLogin() {
    await this.loginButton.click();
  }

  async verifyLoginError(message: string) {
    await expect (this.errorMessage).toHaveText(message);
  }
}