import { By, until } from "selenium-webdriver";

export async function checkH1HelloWorld(driver) {
    await driver.wait(until.elementLocated(By.css(".oj-flex")), 15000);
    await driver.sleep(1000);
    const headings = await driver.findElement(By.css("h1.oj-flex-item"));
    const elementContent = await headings.getText();
    return elementContent === "Hello World!";
}
