// src/verbatempus.js

// Constants
const HOURS_TO_WORDS = {
  0: 'midnight',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four', 
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'noon'
};

const MINUTES_TO_WORDS = {
  1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
  6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
  11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'quarter',
  16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
  21: 'twenty one', 22: 'twenty two', 23: 'twenty three', 24: 'twenty four',
  25: 'twenty five', 26: 'twenty six', 27: 'twenty seven', 28: 'twenty eight',
  29: 'twenty nine', 30: 'half', 31: 'thirty one', 32: 'thirty two',
  33: 'thirty three', 34: 'thirty four', 35: 'thirty five', 36: 'thirty six',
  37: 'thirty seven', 38: 'thirty eight', 39: 'thirty nine', 40: 'forty',
  41: 'forty one', 42: 'forty two', 43: 'forty three', 44: 'forty four',
  45: 'quarter', 46: 'fourteen', 47: 'thirteen', 48: 'twelve', 49: 'eleven',
  50: 'ten', 51: 'nine', 52: 'eight', 53: 'seven', 54: 'six', 55: 'five',
  56: 'four', 57: 'three', 58: 'two', 59: 'one'
};

const MONTHS_TO_WORDS = {
  1: 'january',
  2: 'february', 
  3: 'march',
  4: 'april',
  5: 'may',
  6: 'june',
  7: 'july',
  8: 'august', 
  9: 'september',
  10: 'october',
  11: 'november',
  12: 'december'
};

const DAYS_TO_WORDS = {
  1: 'first',
  2: 'second',
  3: 'third', 
  4: 'fourth',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth',
  11: 'eleventh', 
  12: 'twelfth',
  13: 'thirteenth',
  14: 'fourteenth',
  15: 'fifteenth',
  16: 'sixteenth',
  17: 'seventeenth',
  18: 'eighteenth',
  19: 'nineteenth',
  20: 'twentieth',
  21: 'twenty first',
  22: 'twenty second',
  23: 'twenty third',
  24: 'twenty fourth',
  25: 'twenty fifth',
  26: 'twenty sixth',
  27: 'twenty seventh',
  28: 'twenty eighth',
  29: 'twenty ninth',
  30: 'thirtieth',
  31: 'thirty first'
};

const DAYS_OF_WEEK = {
  1: 'monday',
  2: 'tuesday', 
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  0: 'sunday' // getDay() returns 0 for Sunday
};


// Helper Functions
// Helper function to convert numbers 1-99 to words
function numberToWords(num) {
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
               "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", 
               "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  if (num < 20) return ones[num];
  
  const ten = Math.floor(num / 10);
  const one = num % 10;
  return one ? `${tens[ten]} ${ones[one]}` : tens[ten];
}

// Date Helper Functions
function formatYear(year) {
  // Validate input
  if (!Number.isInteger(year) || year < 0) {
      throw new Error("Year must be a positive integer");
  }

  // Special case for years 2000-2009
  if (year >= 2000 && year <= 2009) {
      return `two thousand${year > 2000 ? " and " + numberToWords(year - 2000) : ""}`;
  }

  // Split year into centuries and remainder
  const century = Math.floor(year / 100);
  const remainder = year % 100;

  // Handle years before 1000
  if (century < 10) {
      if (year < 100) {
          return numberToWords(year);
      }
      return `${numberToWords(century)} hundred${remainder ? " and " + numberToWords(remainder) : ""}`;
  }

  // Handle modern years (1000+)
  if (remainder === 0) {
      return `${numberToWords(century)} hundred`;
  }

  // Handle years like 2010-2999 (twenty ten pattern)
  if (century >= 20) {
      const centuryWord = numberToWords(Math.floor(century/10) * 10);
      const decadeWord = numberToWords(remainder);
      return `${centuryWord} ${decadeWord}`;
  }

  // Handle 1100-1999
  return `${numberToWords(century)} hundred and ${numberToWords(remainder)}`;
}

// Time Helper Functions
function getTimeOfDayRange(hour) {
  if (hour >= 1 && hour <= 11) return 'in the morning';
  if (hour >= 13 && hour <= 16) return 'in the afternoon';
  if (hour >= 17 && hour <= 23) return 'in the evening';
  return '';
}

// 
function validateDateInput(date) {
  // Remove the default parameter from the main functions and handle it here
  if (date === undefined || date === null) {
    throw new Error('Input must be a valid Date object');
  }
  
  if (!(date instanceof Date)) {
    throw new Error('Input must be a valid Date object');
  }
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid Date: date object contains an invalid date');
  }
}

// Primary Functions
// Date Primary Functions
function verboseDate(date) {
  try {
    const inputDate = date === undefined ? new Date() : date;
    validateDateInput(inputDate);  // Changed from date to inputDate
    
    const dayOfWeek = DAYS_OF_WEEK[inputDate.getDay()];
    const month = MONTHS_TO_WORDS[inputDate.getMonth() + 1];
    const dayOfMonth = DAYS_TO_WORDS[inputDate.getDate()];
    const year = formatYear(inputDate.getFullYear());
    
    return `it is ${dayOfWeek} ${month} the ${dayOfMonth} ${year}`;
  } catch (error) {
    throw error;
  }
}

function lengthyDate(date) {
  try {
      const inputDate = date === undefined ? new Date() : date;
      validateDateInput(inputDate);
      
      const dayOfWeek = DAYS_OF_WEEK[inputDate.getDay()];
      const month = MONTHS_TO_WORDS[inputDate.getMonth() + 1];
      const dayOfMonth = DAYS_TO_WORDS[inputDate.getDate()];
      
      return `it is ${dayOfWeek} ${month} ${dayOfMonth}`;
  } catch (error) {
      throw error;
  }
}

// Time Primary Functions
function verboseTime(date) {
  try {
    const inputDate = date === undefined ? new Date() : date;
    validateDateInput(inputDate);
      let hours = inputDate.getHours();
      let minutes = inputDate.getMinutes();
      
      // Handle special cases first 
      if (hours === 0) {
        if (minutes === 0) return 'It is midnight';
        if (minutes === 1) return 'it is one minute past midnight';
        if (minutes === 15) return 'it is quarter past midnight';
        if (minutes === 30) return 'it is half past midnight';
        if (minutes < 45) return `it is ${MINUTES_TO_WORDS[minutes]} minutes past midnight`;
      }
      
      if (hours === 12) {
        if (minutes === 0) return 'It is noon';
        if (minutes === 1) return 'it is one minute past noon';
        if (minutes === 15) return 'it is quarter past noon';
        if (minutes === 30) return 'it is half past noon';
        if (minutes < 45) return `it is ${MINUTES_TO_WORDS[minutes]} minutes past noon`;
      }
      
      // Convert 24h to 12h format
      let displayHour = hours % 12;
      if (displayHour === 0) displayHour = 12;
      
      // For exact hours
      if (minutes === 0) {
        return `it is ${HOURS_TO_WORDS[displayHour]} oclock ${getTimeOfDayRange(hours)}`;
      }
      
      // Handle minutes before next hour (45-59)
      if (minutes >= 45) {
        let nextHour = (hours + 1) % 24;
        let nextDisplayHour = nextHour % 12;
        if (nextDisplayHour === 0) nextDisplayHour = 12;
        
        if (nextHour === 0) {
          if (minutes === 59) return 'it is one minute to midnight';
          return `it is ${MINUTES_TO_WORDS[minutes]} minutes to midnight`;
        }
        
        if (nextHour === 12) {
          if (minutes === 59) return 'it is one minute to noon';
          return `it is ${MINUTES_TO_WORDS[minutes]} minutes to noon`;
        }
        
        if (minutes === 45) {
          return `it is quarter to ${HOURS_TO_WORDS[nextDisplayHour]} oclock ${getTimeOfDayRange(nextHour)}`;
        }
        
        if (minutes === 59) {
          return `it is one minute to ${HOURS_TO_WORDS[nextDisplayHour]} oclock ${getTimeOfDayRange(nextHour)}`;
        }
        
        return `it is ${MINUTES_TO_WORDS[minutes]} minutes to ${HOURS_TO_WORDS[nextDisplayHour]} oclock ${getTimeOfDayRange(nextHour)}`;
      }
      
      // Handle minutes past the hour
      if (minutes === 15) {
        return `it is quarter past ${HOURS_TO_WORDS[displayHour]} oclock ${getTimeOfDayRange(hours)}`;
      }
      
      if (minutes === 30) {
        return `it is half past ${HOURS_TO_WORDS[displayHour]} oclock ${getTimeOfDayRange(hours)}`;
      }
      
      if (minutes === 1) {
        return `it is one minute past ${HOURS_TO_WORDS[displayHour]} oclock ${getTimeOfDayRange(hours)}`;
      }
      
      return `it is ${MINUTES_TO_WORDS[minutes]} minutes past ${HOURS_TO_WORDS[displayHour]} oclock ${getTimeOfDayRange(hours)}`;
      } catch (error) {
        throw error;
  }
}

function lengthyTime(date) {
  try {
    const inputDate = date === undefined ? new Date() : date;
    validateDateInput(inputDate);
    
    let hours = inputDate.getHours();
    let minutes = inputDate.getMinutes();
    
    // Handle special cases first
    if (hours === 0) {
      if (minutes === 0) return 'it is midnight';
      if (minutes === 15) return 'it is quarter past midnight';
      if (minutes === 30) return 'it is half past midnight';
      if (minutes < 45) return `it is ${MINUTES_TO_WORDS[minutes]} past midnight`;
    }
    
    if (hours === 12) {
      if (minutes === 0) return 'it is noon';
      if (minutes === 15) return 'it is quarter past noon';
      if (minutes === 30) return 'it is half past noon';
      if (minutes < 45) return `it is ${MINUTES_TO_WORDS[minutes]} past noon`;
    }
    
    // Convert 24h to 12h format
    let displayHour = hours % 12;
    if (displayHour === 0) displayHour = 12;
    
    // For exact hours
    if (minutes === 0) {
      return `it is ${HOURS_TO_WORDS[displayHour]} ${getTimeOfDayRange(hours)}`;
    }
    
    // Handle minutes before next hour (45-59)
    if (minutes >= 45) {
      let nextHour = (hours + 1) % 24;
      let nextDisplayHour = nextHour % 12;
      if (nextDisplayHour === 0) nextDisplayHour = 12;
      
      if (nextHour === 0) {
        return `it is ${MINUTES_TO_WORDS[minutes]} to midnight`;
      }
      
      if (nextHour === 12) {
        return `it is ${MINUTES_TO_WORDS[minutes]} to noon`;
      }
      
      return `it is ${MINUTES_TO_WORDS[minutes]} to ${HOURS_TO_WORDS[nextDisplayHour]} ${getTimeOfDayRange(nextHour)}`;
    }
    
    // Handle minutes past the hour (1-44)
    if (minutes === 15) {
      return `it is quarter past ${HOURS_TO_WORDS[displayHour]} ${getTimeOfDayRange(hours)}`;
    }
    
    if (minutes === 30) {
      return `it is half past ${HOURS_TO_WORDS[displayHour]} ${getTimeOfDayRange(hours)}`;
    }
    
    return `it is ${MINUTES_TO_WORDS[minutes]} past ${HOURS_TO_WORDS[displayHour]} ${getTimeOfDayRange(hours)}`;
    
  } catch (error) {
    throw error;
  }
}

// Export for testing
export { verboseDate, verboseTime, lengthyDate, lengthyTime };

// Export Functions
export function getVerboseTime() {
  return verboseTime();
}
export function getVerboseDate() {
  return verboseDate();
}
export function getLengthyDate() {
  return lengthyDate();
}
export function getLengthyTime() {
  return lengthyTime();
}
