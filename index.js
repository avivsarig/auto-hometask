const webdriver = require("selenium-webdriver");
const { By, until } = require("selenium-webdriver");
const keys = require("./keys.json");

async function visit_and_login(driver, oracle_url, login_name, login_pw) {
    try {
        await driver.get(oracle_url);

        const usernameField = await driver.wait(
            until.elementLocated(By.id("username"))
        );
        const passwordField = await driver.findElement(By.id("password"));

        await usernameField.sendKeys(login_name);
        await passwordField.sendKeys(login_pw);

        await driver.findElement(By.id("signin")).click();
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

function parseRowContent(rowContent) {
    const [name, status, versionAndLastModified] = rowContent.split("\n");
    const [version, lastModified] = versionAndLastModified.split(" ", 2);

    return {
        name: name,
        status: status,
        version: version,
        lastModified:
            lastModified +
            " " +
            versionAndLastModified.split(" ").slice(2).join(" "),
    };
}

async function print_last_but_one(driver) {
    const table = await driver.wait(
        until.elementLocated(By.className("oj-table-element"))
    );
    await driver.wait(
        until.elementsLocated(By.className("oj-table-data-cell"))
    );
    const tbody = await table.findElement(By.tagName("tbody"));
    const rows = await tbody.findElements(By.tagName("tr"));

    if (rows.length >= 2) {
        const lastButOneRow = rows[rows.length - 2];
        const lastButOneRowContent = await lastButOneRow.getText();

        const result = parseRowContent(lastButOneRowContent);
        console.log(result.name);
    } else {
        console.warn(
            "Not enough rows in the table to select the last but one."
        );
    }
}

async function main() {
    // Get URL and keys for logging
    const ORACLE_URL = "https://i1-abcsprod.builder.europe.oraclecloud.com";
    const login_name = keys.LOGIN_NAME;
    const login_pw = keys.LOGIN_PW;

    const driver = new webdriver.Builder().forBrowser("chrome").build();

    try {
        // Use credentials from keys.json to login
        await visit_and_login(driver, ORACLE_URL, login_name, login_pw);

        // Wait for the list of 
        await print_last_but_one(driver);

        const testAppButton = await driver.findElement(
            By.xpath("//button[contains(text(),'Test App #1')]")
        );
        testAppButton.click();
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        setTimeout(() => driver.quit(), 10000);
    }
}

main();
