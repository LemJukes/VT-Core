// src/fields.js
// Date + optional IANA timeZone -> wall-clock fields. The only module that touches Intl.

const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatters = new Map();

function formatterFor(timeZone) {
  let fmt = formatters.get(timeZone);
  if (!fmt) {
    // An invalid IANA name throws RangeError here. Let it propagate.
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'short',
    });
    formatters.set(timeZone, fmt);
  }
  return fmt;
}

// Assemble fields from Intl.DateTimeFormat#formatToParts output.
// Exported for tests: some ICU versions report midnight as hour 24 under hour12:false.
export function fieldsFromParts(parts) {
  const get = (type) => parts.find((p) => p.type === type).value;
  return {
    year: Number(get('year')),
    month: Number(get('month')),            // 1-12
    day: Number(get('day')),
    weekday: SHORT_WEEKDAYS.indexOf(get('weekday')), // 0 = sunday
    hour: Number(get('hour')) % 24,         // 24 -> 0
    minute: Number(get('minute')),
  };
}

export function fieldsIn(date, timeZone) {
  if (!timeZone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: date.getDay(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }
  return fieldsFromParts(formatterFor(timeZone).formatToParts(date));
}
