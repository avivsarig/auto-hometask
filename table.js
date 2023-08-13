import { By, until } from "selenium-webdriver";

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

export async function printLastButOne(driver) {
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
