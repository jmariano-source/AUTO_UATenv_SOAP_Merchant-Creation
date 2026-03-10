import {test, expect} from '@playwright/test'

test('OPM Login Test', async({page}) => {
//Login Page
    await page.goto('https://starpay-finance-uat.wallyt.net/login')
    await page.getByRole('textbox', { name: 'Account' }).fill('101530000001')
    await page.getByRole('textbox', { name: 'Password' }).fill('ECgfba6B')
    await page.pause()
    //await page.getByRole('button', { name: 'Login' }).click()

//Main Page
    //await page.getByRole('link', { name: 'Companies' }).click()
   // await page.getByRole('link', { name: 'Merchant' }).click()
   // await page.getByText('Register New', { exact: true }).click()
    
   // await page.getByRole('textbox', { name: 'Company Name' }).fill('test')
    //await page.pause()
})