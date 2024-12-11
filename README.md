# Verbatempus

A Clock full of Words.

## Description

Verbatempus is a lightweight javascript library that converts JavaScript Date objects into human-readable/speakable English phrases. It offers multiple formatting styles from verbose to terse.

## Installation

```sh
npm install verbatempus
```

## Usage

```sh

import { verboseTime, shortDate } from './src/verbatempus.js';

// Get current time in verbose format
console.log(verboseTime()); 
// Example: "it is twenty four minutes past ten oclock in the morning"

// Get specific date in short format
console.log(shortDate(new Date(2024, 0, 1)));
// Example: "it is monday the first"

```

## Formatting Styles

### Verbose:
```
verboseDate() // "it is thursday october the twenty fourth twenty twenty four"
verboseTime() // "it is twenty four minutes past ten oclock in the morning"  
```
### Lengthy: 
```
lengthyDate() // "it is thursday october twenty fourth"
lengthyTime() // "it is twenty four past ten in the morning"
```
### Short:
```
shortDate() // "it is thursday the twenty fourth"
shortTime() // "it is twenty past ten am"
```
### Terse:
```
terseDate() // "it is thursday"
terseTime() // "its quarter after ten"
```

## AI Disclaimer

This project was developed using GitHub Copilot with source assistance from Claude 3.5 Sonnet and ChatGPT-4 LLMs as part of the development toolset. Any errors, inefficiencies, or bad practices are still however likely to be the author's fault and therefore responsibility. Any and all constructive feedback on better development strategies is more than welcome.

## License
MIT License - See license.txt for details.