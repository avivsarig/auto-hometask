import { By, until, Key } from "selenium-webdriver";

export async function loadMainWelcome(driver) {
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

    const mainWelcome = mainList.findElement(
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

export async function clickWelcome(driver) {
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

export async function changeHeading(driver) {
    const inputSelector = By.id("general_prop__text_text|input");
    const inputElement = await driver.wait(
        until.elementLocated(inputSelector),
        2000
    );
    await driver.wait(until.elementIsEnabled(inputElement), 2000);
    await inputElement.clear();
    await inputElement.sendKeys("Hello World!", Key.ENTER);
}

export async function runApp(driver) {
    const runButton = await driver.findElement(
        By.css("span.vbcs-icon-font.vbcs-icon__play")
    );
    runButton.click();
}

export async function switchToNewTab(driver) {
    await driver.sleep(3000);
    const handles = await driver.getAllWindowHandles();
    if (handles.length > 1) {
        await driver.switchTo().window(handles[handles.length - 1]);
    } else {
        console.warn("No new tab found");
    }
}
