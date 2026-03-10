import { test } from "@playwright/test";
import { parse } from "csv-parse/sync";
import fs from "fs";

test('Demo Login Test 1', async ({ page }) => {
    // 1. Setup / Login Page
    await page.goto('http://172.100.30.144:47443/ops-portal/#/session');
    await page.getByRole('textbox', { name: 'Username' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Navigation to Merchant Registration
    await page.getByRole('link', { name: 'Companies' }).click();
    await page.getByRole('link', { name: 'Merchant' }).click();
    await page.getByText('Register New', { exact: true }).click();

    // 3. Data Extraction
    // Note: Read file once and use the data directly in the test flow
    const csvdata = parse<Record<string, string>>(fs.readFileSync("tests/testdata/test-data.csv"), {
        columns: true,
        skip_empty_lines: true,
        skip_records_with_empty_values: true
    });

    // 4. Using the Data
    console.log("Company Name:", csvdata[0].CompanyName);
    console.log("Merchant Category:", csvdata[0].MerchantCategory);
    console.log("Merchant Type", csvdata[0].MerchantType);
    console.log("Internal Category", csvdata[0].InternalCategory);
    console.log("Business Name:", csvdata[0].BusinessName);
    console.log("Trade Name", csvdata[0].TradeName);
    //console.log("Account ID", csvdata[0].AccountID);
    console.log("Wallet Tag", csvdata[0].WalletTag);
    console.log("Contact Number", csvdata[0].ContactNumber);
    console.log("SMS Recipient", csvdata[0].SMSRecipient);
    console.log("Business Address", csvdata[0].BusinessAddress);
    console.log("Business City", csvdata[0].BCity);
    console.log("Business Province", csvdata[0].BProvince);
    console.log("Business Zipcode", csvdata[0].BZipcode);
    console.log("Delivery Address", csvdata[0].DeliveryAddress);
    console.log("Delivery City", csvdata[0].DCity);
    console.log("Delivery Province", csvdata[0].DProvince);
    console.log("Delivery Zipcode", csvdata[0].DZipcode);
//Beneficiary Details
    console.log("Beneficiary First Name", csvdata[0].BFname);
    console.log("Beneficiary Middle Name", csvdata[0].BMname);
    console.log("Beneficiary Last Name", csvdata[0].BLname);

    console.log("Birth Date", csvdata[0].BDay);
    console.log("Birth Place", csvdata[0].BPlace);
    console.log("Nationality", csvdata[0].Nationality);

    console.log("Email", csvdata[0].Email);
    console.log("Gender", csvdata[0].Gender);
    console.log("Civil Status", csvdata[0].CivilStatus);

    console.log("Present Address", csvdata[0].PresentAddress);
    console.log("Present Address City", csvdata[0].PreCity);
    console.log("Present Address Province", csvdata[0].PreProvince);
    console.log("Present Address Zipcode", csvdata[0].PreZipcode);

    console.log("Permanent Address", csvdata[0].PermanentAddress);
    console.log("Permanent Address City", csvdata[0].PermaCity);
    console.log("Permanent Address Province", csvdata[0].PermaProvince);
    console.log("Permanent Address Zipcode", csvdata[0].PermaZipcode);
    
    // Interact with the page using the CSV data

    await page.getByRole('textbox', { name: 'Company Name' }).fill(csvdata[0].CompanyName);

    await page.getByLabel('Merchant Category Code').click();
    const dropDownList = page.locator('#referenceNumber');
    dropDownList.selectOption(csvdata[0].MerchantCategory);

    await page.getByLabel('Merchant Type').click();
    const dropDownList2 = page.locator('#merchantType');
    dropDownList2.selectOption(csvdata[0].MerchantType);

    await page.getByLabel('Internal Category').click();
    const dropDownList3 = page.locator('#category');
    dropDownList3.selectOption(csvdata[0].InternalCategory);

    await page.getByRole('textbox', { name: 'Business Name' }).fill(csvdata[0].BusinessName);
    await page.getByRole('textbox', { name: 'Trade Name' }).fill(csvdata[0].TradeName);
    //await page.getByRole('textbox', { name: 'Account ID' }).fill(csvdata[0].AccountID);
    await page.getByLabel('Wallet Tag').click();
    const dropDownList4 = page.locator('#clientTag');
    dropDownList4.selectOption(csvdata[0].WalletTag);

    await page.getByRole('textbox', { name: 'Contact Number' }).fill(csvdata[0].ContactNumber);
    await page.getByRole('textbox', { name: 'SMS Recipient' }).fill(csvdata[0].SMSRecipient);

    await page.getByRole('textbox', { name: 'Business address' }).fill(csvdata[0].BusinessAddress);
    await page.locator('#baCity').fill(csvdata[0].BCity);
    await page.locator('#baProvince').fill(csvdata[0].BProvince);
    await page.locator('#baZipCode').fill(csvdata[0].BZipcode);

    await page.getByRole('textbox', { name: 'Delivery address' }).fill(csvdata[0].DeliveryAddress);
    await page.locator('#daCity').fill(csvdata[0].DCity);
    await page.locator('#daProvince').fill(csvdata[0].DProvince);
    await page.locator('#daZipCode').fill(csvdata[0].DZipcode);

    //beneficiary Info
    await page.getByRole('textbox', { name: 'First name' }).fill(csvdata[0].BFname);
    await page.getByRole('textbox', { name: 'Middle name' }).fill(csvdata[0].BMname);
    await page.getByRole('textbox', { name: 'Last name' }).fill(csvdata[0].BLname);

    // ... preceding code

    // 1. Get the raw date from CSV (expected "MM-DD-YYYY" or "DD-MM-YYYY")
    const rawDate = csvdata[0].BDay; 
    // 2. Reformat to YYYY-MM-DD
    const [month, day, year] = rawDate.split('-');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // 3. Fill with correct format
    await page.getByRole('textbox', { name: 'Birth date' }).fill(formattedDate);
    //await page.getByRole('textbox', { name: 'Birth date' }).fill(csvdata[0].BDay);
    await page.getByRole('textbox', { name: 'Birth place' }).fill(csvdata[0].BPlace);
    await page.getByRole('textbox', { name: 'Nationality' }).fill(csvdata[0].Nationality);


    await page.getByRole('textbox', { name: 'Email' }).fill(csvdata[0].Email);

    await page.getByLabel('Gender').click();
    const dropDownList5 = page.locator('#gender');
    dropDownList5.selectOption(csvdata[0].Gender);

    await page.getByLabel('Civil status').click();
    const dropDownList6 = page.locator('#maritalStatus');
    dropDownList6.selectOption(csvdata[0].CivilStatus);

    await page.getByRole('textbox', { name: 'Present address' }).fill(csvdata[0].PresentAddress);
    await page.locator('#city1').fill(csvdata[0].PreCity);
    await page.locator('#province1').fill(csvdata[0].PreProvince);
    await page.locator('#zipcode1').fill(csvdata[0].PreZipcode);

    await page.getByRole('textbox', { name: 'Permanent address' }).fill(csvdata[0].PermanentAddress);
    await page.locator('#city2').fill(csvdata[0].PermaCity);
    await page.locator('#province2').fill(csvdata[0].PermaProvince);
    await page.locator('#zipcode2').fill(csvdata[0].PermaZipcode);
    await page.locator('#zipcode2').fill(csvdata[0].PermaZipcode);

    //await page.getByText('Merchant Category Code').fill(csvdata[0].MerchantCategory);
    await page.pause()
    
    // Optional: Keep for debugging, but remove in CI/CD
    // await page.pause(); 
})
