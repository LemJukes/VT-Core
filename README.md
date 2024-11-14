
# Verbatempus - A Clock Full of Words, module

I wanted a way to translate a given time into words after discovering an app I used to use a lot is no longer available or maintaned anywhere, so I made one.

## Files

- `index.html`: The main HTML file that displays the current time. This is just a placeholder left to help demonstrate implementation.
- `phrasing-guide.txt`: A guide for phrasing the time in words.
- `README.md`: This file.
- `script.js`: JavaScript file that updates the time every second.
- `styles.css`: CSS file for styling the web page.
- `verbatempus-core.js`: JavaScript module that converts the current time to a verbose time-in-words format.

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