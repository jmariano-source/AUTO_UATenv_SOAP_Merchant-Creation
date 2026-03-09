import test from "@playwright/test";
import {parse} from "csv-parse/sync"
import fs from "fs"

const csvdata=parse<Record<string,string>>(fs.readFileSync("tests/testdata/test-data.csv"),{

    columns:true,
    skip_empty_lines:true,
    skip_records_with_empty_values:true

})


test("Reading data from CSV",async({page})=>{

        console.log(csvdata[0].CompanyName)
        console.log(csvdata[0].MerchantCategory)
        console.log(csvdata[0].MerchantType)
        console.log(csvdata[0].InternalCategory)

    await page.getByRole('textbox', { name: 'Company Name' }).fill(csvdata[0].CompanyName)
    //await page.getByRole('textbox', { name: 'Company Name' }).fill(csvdata[0].MerchantCategory)
    //await page.getByRole('textbox', { name: 'Company Name' }).fill(csvdata[0].MerchantType)
    //await page.getByRole('textbox', { name: 'Company Name' }).fill(csvdata[0].InternalCategory)
})
