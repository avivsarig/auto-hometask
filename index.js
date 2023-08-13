const webdriver = require("selenium-webdriver");
const { By, until, Key } = require("selenium-webdriver");

const keys = require("./keys.json");

async function visitAndLogin(driver, oracle_url, loginName, loginPassword) {
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

async function printLastButOne(driver) {
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
        console.log(
            `🔍 The last but one application on the list is ${result.name}`
        );
    } else {
        console.warn(
            "⚠️ Not enough rows in the table to select the last but one."
        );
    }
}

async function loadMainWelcome(driver) {
    // Find the tree list menu and click the icon the expands the 'main' branch
    const mainLocator = By.css(
        "li#webApps_-_countries_-_app-flow li#webApps_-_countries_-_flows li#webApps_-_countries_-_flows_-_main_-_main-flow"
    );

    const main = await driver.wait(until.elementLocated(mainLocator), 3000);
    const mainExpendButton = await main.findElement(
        By.css("ins.oj-treeview-icon")
    );
    await driver.wait(until.elementIsEnabled(mainExpendButton), 500);
    mainExpendButton.click();

    // In countries→flows→main find main-welcome and click on it
    const mainListLocator = By.css(
        "li#webApps_-_countries_-_app-flow li#webApps_-_countries_-_flows li#webApps_-_countries_-_flows_-_main_-_main-flow ul.oj-treeview-list"
    );

    const mainList = await driver.wait(
        until.elementLocated(mainListLocator),
        3000
    );

    mainWelcome = mainList.findElement(
        By.css(
            "li#webApps_-_countries_-_flows_-_main_-_pages_-_main-welcome-page span.oj-treeview-item-text"
        )
    );
    await driver.wait(until.elementIsEnabled(mainWelcome), 2000);
    mainWelcome.click();

    // wait for iframe content to be loaded
    const iframe = await driver.wait(
        until.elementLocated(
            By.css(".preview-iframe__container .preview-iframe")
        ),
        30000
    );

    await driver.switchTo().frame(iframe);
    await driver.wait(until.elementLocated(By.css(".oj-complete")), 60 * 1000);
    await driver.switchTo().defaultContent();
}

async function clickWelcome(driver) {
    const cssLocator = By.css(
        "#vbcs-pageStructure__treeview .oj-treeview-item"
    );
    const treeItems = await driver.findElements(cssLocator);

    for (const treeItem of treeItems) {
        const headingText = await treeItem.findElement(
            By.xpath(".//span[contains(text(),'Heading')]")
        );
        if (headingText) {
            await headingText.click();
            break;
        }
    }
}

async function changeHeading(driver) {
    const inputSelector = By.id("general_prop__text_text|input");
    const inputElement = await driver.wait(
        until.elementLocated(inputSelector),
        2000
    );
    await driver.wait(until.elementIsEnabled(inputElement), 2000);
    await inputElement.clear();
    await inputElement.sendKeys("Hello World!", Key.ENTER);
}

async function runApp(driver) {
    const runButton = await driver.findElement(
        By.css("span.vbcs-icon-font.vbcs-icon__play")
    );
    runButton.click();
}

async function switchToNewTab(driver) {
    await driver.sleep(3000);
    const handles = await driver.getAllWindowHandles();
    if (handles.length > 1) {
        await driver.switchTo().window(handles[handles.length - 1]);
    } else {
        console.warn("No new tab found");
    }
}

async function checkH1HelloWorld(driver) {
    await driver.wait(until.elementLocated(By.css(".oj-flex")), 15000);
    await driver.sleep(1000);
    const headings = await driver.findElement(By.css("h1.oj-flex-item"));
    const elementContent = await headings.getText();
    return elementContent === "Hello World!";
}

async function main() {
    // Get URL and keys for logging
    const ORACLE_URL = "https://i1-abcsprod.builder.europe.oraclecloud.com";
    const loginName = keys.LOGIN_NAME;
    const loginPassword = keys.LOGIN_PW;

    const driver = new webdriver.Builder().forBrowser("chrome").build();

    try {
        // Use credentials from keys.json to login
        await visitAndLogin(driver, ORACLE_URL, loginName, loginPassword);

        // Wait for the list of apps to load and print the last one
        await printLastButOne(driver);

        // Enter Test App #1
        const testAppButton = await driver.findElement(
            By.xpath("//button[contains(text(),'Test App #1')]")
        );
        testAppButton.click();

        // Find and enter countries > flows > main > main-welcome, wait for canvas to load
        await loadMainWelcome(driver);

        // Click 'Welcome' text in the drop menu
        await clickWelcome(driver);

        // Change heading text to 'Hello world!'
        await changeHeading(driver);

        // Run the application and move to the new tab
        await runApp(driver);
        await switchToNewTab(driver);

        // Test if 'Hello World!' is displayed and print
        const testResult = await checkH1HelloWorld(driver);

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
