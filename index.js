import webdriver from "selenium-webdriver";
import { By } from "selenium-webdriver";

import * as auth from "./auth.js";
import * as table from "./table.js";
import * as nav from "./nav.js";
import * as check from "./check.js";

import keys from "./keys.json" assert { type: "json" };
import config from "./config.json" assert { type: "json" };

async function main() {
    /**
     * Automates specific tasks within Oracle's platform:
     * 1. Log into Oracle Cloud.
     * 2. Print last but one application name.
     * 3. Navigate to "Test App #1".
     * 4. Navigate to "countries > flows > main > main-welcome".
     * 5. Click "Welcome", change text to "Hello world!" or a custom heading if provided.
     * 6. Preview application, verify new heading, print result.
     *
     * @param {string} [process.argv[2]] - Optional new heading to be set. If not provided, defaults to "Hello world!".
     * @throws Prints an error message if an error occurs.
     */

    // Get URL and keys for logging
    const URL = config.ORACLE_URL;
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

        // Change heading text to 'Hello world!' or any other heading provided as an argument
        const newHeading = process.argv[2];
        await nav.changeHeading(driver, newHeading);

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
