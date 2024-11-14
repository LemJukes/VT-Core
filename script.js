// script.js

import { getTimeInWords } from './verbatempus-core.js';

// This function will update the time every second and display it in different formats.
function updateTime() {
    // Standard JavaScript date objects
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Seconds since Unix epoch
    const secondsSinceEpoch = Math.floor(now.getTime() / 1000);
    // Get the time in words from the verbatempus-core.js module
    const timeInWords = getTimeInWords(); 

    // Constructs an array of different time formats
    const timeFormats = [
        'Local Time ' + now.toLocaleTimeString(), // Local time
        'UTC Time ' + now.toUTCString(), // UTC time
        'ISO Format ' + now.toISOString(), // ISO format
        'Local Date & Time: ' + now.toLocaleString(), // Local date and time
        `Seconds since Unix epoch: ${secondsSinceEpoch}`, // Seconds since Unix epoch
        `${timeInWords}` // Time in words
    ];

    document.getElementById('time').innerHTML = timeFormats.map(format => `<p>${format}</p>`).join('');
}

setInterval(updateTime, 1000);
updateTime();
