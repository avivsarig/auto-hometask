import { By, until } from "selenium-webdriver";

export async function checkH1HelloWorld(driver) {
    /**
     * Checks for "Hello World!" in H1 element after waiting for a specific container.
     *
     * @param {selenium-webdriver.WebDriver} driver - WebDriver controlling the browser.
     * @returns {Promise<boolean>} True if "Hello World!" is found; otherwise, false.
     */

    await driver.wait(until.elementLocated(By.css(".oj-flex")), 15000);
    await driver.sleep(1000);
    const headings = await driver.findElement(By.css("h1.oj-flex-item"));
    const elementContent = await headings.getText();
    return elementContent === "Hello World!";
}
