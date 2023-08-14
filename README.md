# Automation App

## Overview

This application is designed to automate specific tasks within Oracle's platform using Selenium WebDriver. Its primary purpose is to automate repetitive tasks, such as logging into Oracle Cloud, navigating through the platform, changing specific text headings, and verifying their appearance.

## Features

-   **Login Automation**: Logs into Oracle Cloud using provided credentials.
-   **Navigation Automation**: Navigates through Oracle Cloud to specific pages and applications.
-   **Text Manipulation**: Changes text headings on specific pages.
-   **Verification**: Verifies that the changes are correctly displayed.
-   **Optional Customization**: Allows for a custom heading and reset functionality via command-line arguments.

## Prerequisites

-   Node.js v18.15.0 or later.
-   Chrome browser (or another browser supported by Selenium).
-   Necessary npm packages including Selenium WebDriver.

## Installation

1. **Clone the repository** or download the source code.
2. **Navigate** to the project directory:

    ```bash
    cd path/to/Automation/App
    ```

3. **Install the required dependencies**:

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

1. **Compile or transpile** the code if it's written using ES modules.
2. **Run the application** with the basic command:

    ```bash
    node index.js
    ```

3. **Customize the Heading** (Optional): You can provide a custom heading as the first argument:

    ```bash
    node index.js "My Custom Heading"
    ```

4. **Reset the Heading** (Optional): You can reset the heading to its original state by including the `--reset` flag:

    ```bash
    node index.js --reset
    ```

    or with a custom heading:

    ```bash
    node index.js "My Custom Heading" --reset
    ```

### Understanding the Command-Line Arguments

-   `newHeading`: An optional first argument that sets a custom heading text.
-   `--reset`: An optional flag that resets the heading to its original state.
