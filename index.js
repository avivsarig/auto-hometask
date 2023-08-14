import webdriver from "selenium-webdriver";
import { By } from "selenium-webdriver";

import * as auth from "./auth.js";
import * as table from "./table.js";
import * as nav from "./nav.js";
import * as check from "./check.js";

import keys from "./keys.json" assert { type: "json" };
import settings from "./setting.json" assert { type: "json" };

async function main() {
    // Get URL and keys for logging
    const URL = settings.ORACLE_URL;
    const loginName = keys.LOGIN_NAME;
    const loginPassword = keys.LOGIN_PW;

    const driver = new webdriver.Builder().forBrowser("chrome").build();

    try {
        // Use credentials from keys.json to login
        await auth.visitAndLogin(driver, URL, loginName, loginPassword);

        // Wait for the list of apps to load and print the last one
        await table.printLastButOne(driver);

        // Enter Test App #1
        const testAppButton = await driver.findElement(
            By.xpath("//button[contains(text(),'Test App #1')]")
        );
        testAppButton.click();

        // Find and enter countries > flows > main > main-welcome, wait for canvas to load
        await nav.loadMainWelcome(driver);

        // Click 'Welcome' text in the drop menu
        await nav.clickWelcome(driver);

        // Change heading text to 'Hello world!'
        await nav.changeHeading(driver);

        // Run the application and move to the new tab
        await nav.runApp(driver);
        await nav.switchToNewTab(driver);

        // Test if 'Hello World!' is displayed and print
        const testResult = await check.checkH1HelloWorld(driver);

        const output = `The test ${testResult ? "succeeded" : "failed"}!`;
        console.log(output);

        return testResult;
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        setTimeout(() => driver.quit(), 2000);
    }
}

main();
