import {test, expect} from '@playwright/test'

test('Demo Login Test 1', async({page}) => {
//Login Page
    await page.goto('http://172.100.30.144:47443/ops-portal/#/session')
    //await page.pause()
    await page.getByRole('textbox', { name: 'Username' }).fill('admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin')
    await page.getByRole('button', { name: 'Login' }).click()

//Main Page
    await page.getByRole('link', { name: 'Companies' }).click()
    await page.getByRole('link', { name: 'Merchant' }).click()
    await page.getByText('Register New', { exact: true }).click()
    
    await page.getByRole('textbox', { name: 'Company Name' }).fill('test')
    await page.pause()
})