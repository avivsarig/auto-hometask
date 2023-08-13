import { By, until } from "selenium-webdriver";

export async function visitAndLogin(
    driver,
    oracle_url,
    loginName,
    loginPassword
) {
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
