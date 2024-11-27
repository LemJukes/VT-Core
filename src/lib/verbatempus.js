// lib/verbatempus.js

// lib/verbatempus.js

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

function getTimeOfDay(hour) {
  if (hour >= 1 && hour <= 11) return 'in the morning';
  if (hour >= 13 && hour <= 16) return 'in the afternoon';
  if (hour >= 17 && hour <= 23) return 'in the evening';
  return '';
}

function verboseTime(date = new Date()) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  
  // Handle special cases first
  if (hours === 0 && minutes === 0) return 'It is midnight';
  if (hours === 12 && minutes === 0) return 'It is noon';
  
  // Convert 24h to 12h format
  let displayHour = hours % 12;
  if (displayHour === 0) displayHour = 12;
  
  // For exact hours
  if (minutes === 0) {
    return `It is ${HOURS_TO_WORDS[displayHour]} oclock ${getTimeOfDay(hours)}`;
  }
  
  // Handle minutes before next hour (45-59)
  if (minutes >= 45) {
    let nextHour = (hours + 1) % 24;
    let nextDisplayHour = nextHour % 12;
    if (nextDisplayHour === 0) nextDisplayHour = 12;
    
    if (nextHour === 0) return `It is ${MINUTES_TO_WORDS[minutes]} to midnight`;
    if (nextHour === 12) return `It is ${MINUTES_TO_WORDS[minutes]} to noon`;
    
    return `It is ${MINUTES_TO_WORDS[minutes]} minutes to ${HOURS_TO_WORDS[nextDisplayHour]} oclock ${getTimeOfDay(nextHour)}`;
  }
  
  // Handle regular minutes past the hour
  return `It is ${MINUTES_TO_WORDS[minutes]} minutes past ${HOURS_TO_WORDS[displayHour]} oclock ${getTimeOfDay(hours)}`;
}

const verbatempus = Date();

export function getVerbatempus() {
  return verboseTime();
}