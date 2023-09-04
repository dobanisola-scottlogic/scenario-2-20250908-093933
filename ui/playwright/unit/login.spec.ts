import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageObjectModel/login-page';

const emptyFieldErrors: {
  usernameValue: string
  username: string;
  passwordValue: string
  password: string;

}[] = [
  { usernameValue: '[empty]', username: '', passwordValue: '[empty]', password: '' },
  { usernameValue: 'admin', username: 'admin', passwordValue: '[empty]', password: '' },
  { usernameValue: '[empty]', username: '', passwordValue: 'secret', password: 'secret' },
];

test('admin can successfully log in', async ({ page }) => {
  await page.goto('http://localhost:8080/application/');
  const login = new LoginPage(page);
  await login.inputUsername('admin');
  await login.inputPassword('secret');
  await login.attemptLogin();
  await expect(page).toHaveTitle('Hackathon Viewer');
});

for (const creds of emptyFieldErrors) {
  test(`username ${creds.usernameValue} and password ${creds.passwordValue} returns empty fields error message`, async ({
    page,
  }) => {
    await page.goto('http://localhost:8080/application/');
    const login = new LoginPage(page);
    await login.inputUsername(creds.username);
    await login.inputPassword(creds.password);
    await login.attemptLogin();
    await login.verifyLoginErrorIs('Username and password are required.');
  });
}

test('invalid username and password returns unable to login error message', async ({
  page,
}) => {
  await page.goto('http://localhost:8080/application/');
  const login = new LoginPage(page);
  await login.inputUsername("admin");
  await login.inputPassword("wrong");
  await login.attemptLogin();
  await login.verifyLoginErrorIs("Sorry we couldn't log you in. Please try again later.");
});
