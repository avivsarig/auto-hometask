import { By, until } from "selenium-webdriver";

export async function visitAndLogin(
    driver,
    oracle_url,
    loginName,
    loginPassword
) {
    /**
     * Visits the Oracle URL and logs in using the provided credentials.
     * Uses Selenium WebDriver to interact with the web page.
     *
     * @param {object} driver - WebDriver instance controlling a browser.
     * @param {string} oracle_url - URL of the Oracle login page.
     * @param {string} loginName - User's login name.
     * @param {string} loginPassword - User's login password.
     * @throws Will print an error message to the console if an error occurs.
     */

    try {
        await driver.get(oracle_url);

        const usernameField = await driver.wait(
            until.elementLocated(By.id("username"))
        );
        const passwordField = await driver.findElement(By.id("password"));

        await usernameField.sendKeys(loginName);
        await passwordField.sendKeys(loginPassword);

        await driver.findElement(By.id("signin")).click();
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
