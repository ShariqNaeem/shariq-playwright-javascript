const { expect } = require('@playwright/test')

exports.StoreFrontPage = class StoreFrontPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        this.addStorefront = page.locator('span.mat-button-wrapper', { hasText: ' Add Storefront ' })
        this.storefrontName = page.locator('#sf-name-input')
        this.storefrontDescription = page.locator('[formcontrolname="storefrontDescription"]')
        this.addApplicationButton = page.locator('#add-app-btn')
        this.addUserGroupButton = page.locator('#add-user-group-btn')
        this.table = page.locator('table[role="grid"]')
        this.saveButton = page.locator('.dialog-button-container button.btn-save')
        this.saveDraftButton = page.locator('.save-publish-container button.btn-secondary')
        this.publishButton = page.locator('.save-publish-container button.btn-primary')
        this.alertDialog = page.locator('[role="alertdialog"]')
        this.successMessgae = page.locator('#header')
        this.userTab = page.locator('div.dialog-content div.mat-tab-label-content', { hasText: 'Users' })
        this.draftsSection = page.locator('span.mat-button-toggle-label-content', { hasText: ' Drafts ' })
        this.publishedSection = page.locator('span.mat-button-toggle-label-content', { hasText: ' Published ' })
        this.actionStorefrontButton = page.locator('.cdk-drop-list.drag-drop-list >div:first-child div.sf-card-actions button')
        this.editOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Edit' })
        this.deleteOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Delete' })
        this.editingAlert = page.locator('span.alert-text')
        this.addButtonInDraft = page.locator('div.mat-tab-label-content button')
        this.groupAndUsers = page.locator('.mat-tab-label-content', { hasText: 'Groups & Users' })
        this.publishCommentField = page.locator('#publish-comment')
        this.publishBtnModal = page.locator('#publish-btn')
        this.confirmWorkpodNameField = page.locator('input[formcontrolname="confirmName"]')
        this.deleteBtnInModal = page.locator('#confirm-btn')
        this.firstStorefrontName = page.locator('.cdk-drop-list.drag-drop-list > div:first-child div.sf-title')
        this.discardStorefrontDraft = page.locator('#delete-sf-btn')
        this.roleAlert = page.locator('[role="alert"]')
        this.searchInModal = page.locator('[role="dialog"] .mat-form-field-infix input')
        this.firstWorkpodCard = page.locator('div.drag-drop-list>div:first-child div.sf-card')
        this.editButton = page.locator('button.view-edit-top-btn')
        this.actionButtonsInEdit = page.locator('#app-table button.actions-button')
        this.changePolicyOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Change Policy' })
        this.viewRivisionBtn = page.locator('div.revision-btn')
        this.revisionHistoryItems = page.locator('.revision-panel .revision-item')
        this.copyAsNewDraft = page.locator('button span.mat-button-wrapper', { hasText: ' Copy as New Draft ' })
        this.rollback = page.locator('button span.mat-button-wrapper', { hasText: ' Rollback ' })
        this.rollbackWorkpod = page.locator('[role="dialog"] #confirm-btn')
        this.removeButtonEdit = page.locator('td.mat-column-remove button')
        this.searchField = page.locator('#search-input')
    }

    async clickOnCheckBox(index) {
        const checkbox = this.page.locator(`tbody tr:nth-child(${index}) td:nth-child(1) span.mat-checkbox-inner-container`)
        await checkbox.click()
        //expect(await checkbox.isChecked()).toBeTruthy()
    }

    async clickOnCheckBoxByText(name) {
        const checkbox = this.page.locator(`//div[@class="dialog-content"]//td[contains(text(),"${name}")]`)
        await checkbox.first().click()
    }

    async setNameAndDescription(name, description) {
        await this.storefrontName.fill(name)
        await this.storefrontDescription.fill(description)
    }

    async enterPublishComment(comment) {
        await this.publishCommentField.fill(comment)
        await this.publishBtnModal.click()
    }

    async enterWorkpodNameAndDelete(name) {
        await this.confirmWorkpodNameField.fill(name)
        await this.deleteBtnInModal.click()
    }

    async firstStorefrontText() {
        await this.page.evaluate(() => {
            const parentElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.sf-title');
            const childElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.sf-title badge');
            const parentText = parentElement.textContent.split(childElement.textContent);
            return parentText[0];
        });
    }

    async deleteFirstStorefront() {
        const workpodName = await this.page.evaluate(() => {
            const parentElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.sf-title');
            const childElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.sf-title badge');
            const parentText = parentElement.textContent.split(childElement.textContent);
            return parentText[0];
        });

        await this.actionStorefrontButton.click()
        await this.deleteOption.click()
        await this.enterWorkpodNameAndDelete(workpodName.trim());
    }

    generateString(length = 12) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    async checkAllCheckboxes(length = null) {
        await this.page.waitForSelector('tbody tr:nth-child(1) td:nth-child(1) span.mat-checkbox-inner-container')
        const checkboxes = await this.page.$$('tbody tr td:nth-child(1) span.mat-checkbox-inner-container');
        let checkboxesCount = checkboxes.length;

        if (length === null) {
            length = checkboxesCount;
        }

        for (let i = 0; i < length; i++) {
            await checkboxes[i].click();
        }
    }

    async checkAllCheckboxesFromJson(namesArray) {
        for (let i = 0; i < namesArray.length; i++) {
            await this.clickOnCheckBoxByText(namesArray[i])
        }
    }

    async verfiyAlertByText(text) {
        const alert = await this.page.locator(`//*[@role="alertdialog" and contains(text(), "${text}")]`)
        await expect.soft(alert).toBeVisible()
    }

    async deleteAllStorefronts(searchName, messageText) {
        await this.searchField.click()
        await this.searchField.fill(`${searchName}`, { delay: 100 });
        await this.searchField.press('Enter');
        await this.page.waitForTimeout(2000) // This timeout is used because search functionality took some time to update the DOM

        const noStoreFrontsFound = await this.page.locator('span.no-entities-title');
        await this.page.waitForSelector('div.drag-drop-list>div:first-child')
        const storeFronts = await this.page.$$('div.drag-drop-list>div');

        console.log(storeFronts.length);

        for (let i = 0; i < storeFronts.length; i++) {
            const elementFlag = await noStoreFrontsFound.isVisible()
            if (elementFlag) {
                break;
            }

            await this.deleteFirstStorefront()
            await expect.soft(this.alertDialog).toContainText(messageText)

            await this.searchField.click()
            await this.searchField.fill(searchName, { delay: 100 });
            await this.searchField.press('Enter');
            await this.page.waitForTimeout(2000) // This timeout is used because search functionality took some time to update the DOM
        }
    }
};