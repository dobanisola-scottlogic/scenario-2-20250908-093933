import { APIResponse, expect, type Locator, type Page } from '@playwright/test';

export class HackathonListPage {
  readonly page: Page;
  readonly hackathonName: ({
    hackathonName,
  }: {
    hackathonName: string;
  }) => Locator;
  readonly hackathonMap: ({
    hackathonName,
  }: {
    hackathonName: string;
  }) => Locator;
  readonly hackathonBot: ({
    hackathonName,
  }: {
    hackathonName: string;
  }) => Locator;
  readonly navigationBarDropdownButton: Locator;
  readonly logoutButton: Locator;
  readonly addNewHackathonButton: Locator;
  readonly hackathonMenuButton: ({
    hackathonName,
  }: {
    hackathonName: string;
  }) => Locator;
  readonly editHackathonButton: Locator;
  readonly deleteHackathonButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hackathonName = ({ hackathonName }) =>
      page
        .getByRole('row', { name: `${hackathonName}` })
        .getByRole('rowheader');
    this.hackathonMap = ({ hackathonName }) =>
      page
        .getByRole('row', { name: `${hackathonName}` })
        .getByRole('cell')
        .nth(0);
    this.hackathonBot = ({ hackathonName }) =>
      page
        .getByRole('row', { name: `${hackathonName}` })
        .getByRole('cell')
        .nth(1);
    this.navigationBarDropdownButton = page.getByRole('button', {
      name: 'admin',
    });
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.addNewHackathonButton = page.getByRole('button', {
      name: 'Add a new hackathon',
    });
    this.hackathonMenuButton = ({ hackathonName }) =>
      page.getByRole('row', { name: `${hackathonName}` }).getByLabel('more');
    this.editHackathonButton = page.getByRole('menuitem', {
      name: 'Edit...',
    });
    this.deleteHackathonButton = page.getByRole('menuitem', {
      name: 'Delete...',
    });
  }

  async logoutUsingDropdown() {
    await this.navigationBarDropdownButton.click();
    await this.logoutButton.click();
  }

  async openCreateHackathonPopup() {
    await this.addNewHackathonButton.click();
  }

  async openDeletePopupOfHackathonWithName(hackathonName: string) {
    await this.hackathonMenuButton({ hackathonName: hackathonName }).click();
    await this.deleteHackathonButton.click();
  }

  async openEditHackathonPopup(hackathonName: string) {
    await this.hackathonMenuButton({
      hackathonName: hackathonName,
    }).click();
    await this.editHackathonButton.click();
  }

  async verifyLoginSuccess() {
    await expect(this.addNewHackathonButton).toBeVisible();
  }

  async expectNumberOfHackathonsToBe(hackathonNumber: number) {
    const hackathonResponse: APIResponse = await this.page.request.get(
      'http://localhost:8080/application/api/hackathon'
    );
    const hackathonResponseJSON = (await hackathonResponse.json()) as [];
    expect(hackathonResponseJSON).toHaveLength(hackathonNumber);
  }

  async checkExistenceOfHackathonInTableWithName(
    hackathonName: string,
    shouldExist: boolean
  ) {
    let expectedAmount = 0;
    if (shouldExist) {
      expectedAmount = 1;
    }
    expect(
      await this.hackathonMenuButton({ hackathonName: hackathonName }).count()
    ).toBe(expectedAmount);
  }

  async clearAnyExistingHackathonWithName(hackathonName: string) {
    const hackathonPostResponse = await this.page.request.get(
      `http://localhost:8080/application/api/hackathon/${hackathonName.toLowerCase()}`
    );
    if (hackathonPostResponse.status() == 200) {
      const hackathonDeleteResponse = await this.page.request.delete(
        `http://localhost:8080/application/api/hackathon/${hackathonName.toLowerCase()}`
      );
      expect(hackathonDeleteResponse.status()).toBe(204);
    }
  }

  async verifyHackathonDetails(
    hackathonName: string,
    hackathonMap: string,
    hackathonBot: string
  ) {
    await expect(
      this.hackathonName({ hackathonName: hackathonName })
    ).toHaveText(hackathonName);
    await expect(
      this.hackathonMap({ hackathonName: hackathonName })
    ).toHaveText(hackathonMap);
    await expect(
      this.hackathonBot({ hackathonName: hackathonName })
    ).toHaveText(hackathonBot);
  }
}
