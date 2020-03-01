const puppeteer   = require('puppeteer');
const {selectors} = require('./config/selectos');
const {searchtendersUrl, browserOptions, keyboardOptions} = require('./config/configs');

(async () => {
	let browser, page;
	try {
		browser = await puppeteer.launch(browserOptions);
        page    = await browser.newPage();

        await makeSearch(page);
        const result = await checkResults(page);

        await page.close();
		await browser.close();

	} catch (error) {
        if (page) {
            await page.close();
        }

		if (browser) {
			await browser.close();
		}
		console.error(error.message);
	}
})()

async function makeSearch(page) {
    const formData = getFormData();
    await page.goto(searchtendersUrl)
    await page.waitForSelector(selectors.textAreaForm)
    await page.focus(selectors.textAreaForm)
    await page.keyboard.type(formData, keyboardOptions)
    await page.click(selectors.submitFormButton);
}

async function handleSubmition(page) {
    console.log(`Output >> ${selectors.numberColumnFirstResult} element didn't appear.`);

    await page.waitForSelector(selectors.failFormSubmitionAlert)
    .catch((error)=> {
        console.log(`Output >> ${selectors.failFormSubmitionAlert} element didn't appear.`, error);
    });

    const alert = await page.$(selectors.failFormSubmitionAlert);
    const alertText = await page.evaluate(el => el.textContent, alert);
    console.log(`Output >> form submition failed >>`, alertText.trim());

    return false;
}

function getFormData() {
    const args = process.argv.slice(2) || '055869-2020';
    const numberToCheck = args[0];
    let formData = `ND=[${numberToCheck}]`
    return formData;
}


async function checkResults(page) {
    const pass = await page
    .waitForSelector(selectors.numberColumnFirstResult, { timeout: 5000 })
    .catch (async (error) => {
        const failResponse = await handleSubmition(page)
        return failResponse;
    })

    if (!pass) {
        return pass;
    }

    const first = await page.$(selectors.numberColumnFirstResult);
    const firstNumber = await page.evaluate(el => el.textContent, first);
    console.log(firstNumber.trim());
    await page.click(selectors.numberColumnFirstResult);
    return true;
}
