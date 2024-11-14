
# Verbatempus - A Clock Full of Words, module

I wanted a way to translate a given time into words after discovering an app I used to use a lot is no longer available or maintaned anywhere, so I made one.

## Features

- Converts the current time into a verbose time-in-words format.
- Supports special phrases for specific minutes:
  - 15 minutes: "QUARTER"
  - 30 minutes: "HALF"
  - 45 minutes: "THREE QUARTERS"
- Displays the time with appropriate time-of-day phrases:
  - 1 AM to 11 AM: "IN THE MORNING"
  - 1 PM to 4 PM: "IN THE AFTERNOON"
  - 5 PM to 11 PM: "IN THE EVENING"
- Updates the time every minute.
- Provides exact time-in-words phrasing for each minute of the hour.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/verbatempus.git
    ```
2. Navigate to the project directory:
    ```sh
    cd verbatempus
    ```
3. Open the project in Visual Studio Code:
    ```sh
    code .
    ```
4. Ensure you have Live Server extension installed in Visual Studio Code.

## Usage

1. Open the `index.html` file in your web browser to see the current time displayed in various formats.
2. Alternatively, you can use the Live Server extension in Visual Studio Code:
    - Right-click on `index.html` and select "Open with Live Server".
    - The page will automatically refresh every second to display the updated time.
3. To use the `getTimeInWords` function in your own JavaScript code:
    - Import the function from the `verbatempus-core.js` module:
        ```javascript
        import { getTimeInWords } from './verbatempus-core.js';
        ```
    - Call the function to get the current time in words:
        ```javascript
        const timeInWords = getTimeInWords();
        console.log(timeInWords); // Outputs the current time in words
        ```
## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-name
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```sh
    git push origin feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](license.txt) file for details.

## Disclaimer

I am entirely self taught and make extensive use of LLMs and AI tools like ChatGPT & Claude 