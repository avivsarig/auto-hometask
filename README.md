# Oracle Automation App

This application automates specific tasks within Oracle's platform using Selenium WebDriver. It logs into a specified URL, performs various interactions, and checks specific content on a web page.

## Prerequisites

-   Node.js v18.15.0 or later
-   Chrome browser (or another browser supported by Selenium)
-   Necessary npm packages including Selenium WebDriver

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory:

    ```bash
    cd path/to/Oracle
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

## Configuration

Ensure that the `keys.json` file is present in the project directory with the required login credentials:

```json
{
    "LOGIN_NAME": "your_username",
    "LOGIN_PW": "your_password"
}
```

## Running the App

1. Compile or transpile the code if it's written using ES modules.
2. Run the application with the following command:

    ```bash
    node index.js
    ```
