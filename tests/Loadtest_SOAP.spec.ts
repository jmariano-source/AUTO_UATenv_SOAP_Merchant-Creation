import { test, expect } from "@playwright/test";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

// 1. Load and parse CSV data
const csvdata = parse(fs.readFileSync(path.join(__dirname, "testdata/test-data.csv")), {
    columns: true,
    skip_empty_lines: true,
    skip_records_with_empty_values: true
});

for (const record of csvdata) {
    test(`Merchant Registration: ${record.CompanyName}`, async ({ page }) => {
        
        // --- Step 1: Login ---
        await page.goto('http://172.100.30.144:47443/ops-portal/#/session');
        await page.getByRole('textbox', { name: 'Username' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password' }).fill('admin');
        await page.getByRole('button', { name: 'Login' }).click();

        // --- Step 2: Navigation ---
        await page.getByRole('link', { name: 'Companies' }).click();
        await page.getByRole('link', { name: 'Merchant' }).click();
        await page.getByText('Register New', { exact: true }).click();
        
        // Wait for form to load
        await expect(page.getByRole('heading', { name: 'Register new Merchant' })).toBeVisible();

        // --- Step 3: Form Entry ---
        await page.getByRole('textbox', { name: 'Company Name' }).fill(record.CompanyName);
        await page.locator('#referenceNumber').selectOption(record.MerchantCategory);
        await page.locator('#merchantType').selectOption(record.MerchantType);
        await page.locator('#category').selectOption(record.InternalCategory);
        await page.getByRole('textbox', { name: 'Business Name' }).fill(record.BusinessName);
        await page.getByRole('textbox', { name: 'Trade Name' }).fill(record.TradeName);
        await page.locator('#clientTag').selectOption(record.WalletTag);
        await page.getByRole('textbox', { name: 'Contact Number' }).fill(record.ContactNumber);
        await page.getByRole('textbox', { name: 'SMS Recipient' }).fill(record.SMSRecipient);

        // Address Fields
        await page.getByRole('textbox', { name: 'Business address' }).fill(record.BusinessAddress);
        await page.locator('#baCity').fill(record.BCity);
        await page.locator('#baProvince').fill(record.BProvince);
        await page.locator('#baZipCode').fill(record.BZipcode);
        await page.getByRole('textbox', { name: 'Delivery address' }).fill(record.DeliveryAddress);
        await page.locator('#daCity').fill(record.DCity);
        await page.locator('#daProvince').fill(record.DProvince);
        await page.locator('#daZipCode').fill(record.DZipcode);

        // Beneficiary Info
        await page.getByRole('textbox', { name: 'First name' }).fill(record.BFname);
        await page.getByRole('textbox', { name: 'Middle name' }).fill(record.BMname);
        await page.getByRole('textbox', { name: 'Last name' }).fill(record.BLname);

        const [month, day, year] = record.BDay.split('-');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        await page.getByRole('textbox', { name: 'Birth date' }).fill(formattedDate);

        await page.getByRole('textbox', { name: 'Birth place' }).fill(record.BPlace);
        await page.getByRole('textbox', { name: 'Nationality' }).fill(record.Nationality);
        await page.getByRole('textbox', { name: 'Email' }).fill(record.Email);
        await page.locator('#gender').selectOption(record.Gender);
        await page.locator('#maritalStatus').selectOption(record.CivilStatus);

        await page.getByRole('textbox', { name: 'Present address' }).fill(record.PresentAddress);
        await page.locator('#city1').fill(record.PreCity);
        await page.locator('#province1').fill(record.PreProvince);
        await page.locator('#zipcode1').fill(record.PreZipcode);
        await page.getByRole('textbox', { name: 'Permanent address' }).fill(record.PermanentAddress);
        await page.locator('#city2').fill(record.PermaCity);
        await page.locator('#province2').fill(record.PermaProvince);
        await page.locator('#zipcode2').fill(record.PermaZipcode);
        
        // --- Step 4: Toggle Logic - Settlement PERIOD (FIXED) ---
        if (record.SettlementPeriod === 'true') {
            // Note: If this fails, use .click({ force: true }) or target by label
            await page.locator('.mat-slide-toggle-thumb').first().click();
            await page.getByLabel('Recurrence').click();
            await page.locator('#settlementPeriodOption').selectOption('Real-time');
            await page.locator('#settlementOptions').click();
            await page.locator('#settlementOptions').selectOption('SEND Wallet');
            await page.getByRole('group', { name: 'Settlement Options' }).getByLabel('Company Name').fill(record.SCompanyName);
            await page.getByRole('textbox', { name: 'SEND Account Id' }).fill(record.SendAccountID);
        }
        if (record.FeeSettings === 'true'){
            await page.locator('#mat-slide-toggle-2 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
            //await page.locator('#mat-slide-toggle-4 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb')
        }
// --- Instapay ---
        if (record.Instapay === 'true'){

            await page.locator('#mat-slide-toggle-4 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
        }

        if (record.iFixedFee === 'true'){

            await page.locator('#mat-slide-toggle-9 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
            await page.getByRole('spinbutton', { name: 'Fixed Fee' }).fill(record.FixFee);
        }
        if (record.iMDR === 'true'){

            await page.locator('#mat-slide-toggle-10 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
            await page.getByText('Merchant Discount Rate (MDR)').fill(record.MDR);
        }
// --- Fee Teering - STARPAY INTERNAL TIERING ---
        
        if (record.FeeTeering === 'true'){
            await page.locator('#mat-slide-toggle-3 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
        
        if (record.SITFixFee === 'true'){

            await page.locator('#mat-slide-toggle-11 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
            await page.locator('#mtfFixedFee').fill(record.SITFixFeeValue);
        }

        if (record.SITMDR === 'true'){
                await page.locator('#mat-slide-toggle-12 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
                await page.locator('#mtfMdr').fill(record.SITMDRValue);
            }
          
// Upload CSV File
const filePath = path.resolve(__dirname, 'testdata/tiering-testdata.csv');

// 2. Start waiting for the file chooser before clicking
const fileChooserPromise = page.waitForEvent('filechooser');

// 3. Click the div that triggers the upload
await page.locator('#dropAreaDynamic').click();

// 4. Wait for the chooser to appear and set the files
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles(filePath);
        }

        await page.pause();
// --- STARPAY to STARPAY Merchant ---
        if (record.S2SMerchant === 'true'){
            await page.locator('#mat-slide-toggle-5 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
        }

        if (record.S2SFixedFee === 'true'){

            await page.locator('#mat-slide-toggle-11 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
            await page.locator('#spFee').fill(record.S2SFixFee);
        }

        if (record.S2SMDR === 'true'){

            await page.locator('#mat-slide-toggle-12 > .mat-slide-toggle-label > .mat-slide-toggle-bar > .mat-slide-toggle-thumb-container > .mat-slide-toggle-thumb').click();
            await page.getByRole('spinbutton', { name: 'Merchant Discount Rate (MDR)' }).fill(record.S2SMDR2);
        }
        // --- Finalize ---
        //await page.getByRole('button', { name: 'Save' }).click();
        // await expect(page.getByText('Success')).toBeVisible();
        
        

        await page.pause()
    });
}