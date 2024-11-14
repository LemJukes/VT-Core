
# Verbatempus - A Clock Libary Full of Words

I wanted a way to translate a given time into words after discovering an app I used to use a lot is no longer available or maintaned anywhere, so I made one.

## Files

- `index.html`: The main HTML file that displays the current time.
- `phrasing-guide.txt`: A guide for phrasing the time in words.
- `README.md`: This file.
- `script.js`: JavaScript file that updates the time every second.
- `styles.css`: CSS file for styling the web page.
- `verbatempus-core.js`: JavaScript module that converts the current time to a verbose time-in-words format.

## Features

- Displays the current time in various formats:
  - Local Time
  - UTC Time
  - ISO Format
  - Local Date & Time
  - Seconds since Unix epoch
  - Verbose time-in-words format
- Updates the time every second.
- Verbose time-in-words format includes special phrases for certain times (e.g., "QUARTER PAST", "HALF PAST").

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