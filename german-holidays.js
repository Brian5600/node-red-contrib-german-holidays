/********************************************
 * german-holidays:
 *********************************************/

/*!
 * This is based ont he feiertage.js
 * @repository https://github.com/sfakir/feiertagejs
 * @docs https://github.com/sfakir/feiertagejs/blob/master/docs.md
 *
 * Copyright 2015-2018 Simon Fakir
 * Released under the MIT license
 */

const allRegions = [
  'BW',
  'BY',
  'BE',
  'BB',
  'HB',
  'HE',
  'HH',
  'MV',
  'NI',
  'NW',
  'RP',
  'SL',
  'SN',
  'ST',
  'SH',
  'TH',
  'BUND',
  'ALL',
];

const allHolidays = [
  'NEUJAHRSTAG',
  'HEILIGEDREIKOENIGE',
  'KARFREITAG',
  'OSTERSONNTAG',
  'OSTERMONTAG',
  'TAG_DER_ARBEIT',
  'CHRISTIHIMMELFAHRT',
  'MARIAHIMMELFAHRT',
  'PFINGSTSONNTAG',
  'PFINGSTMONTAG',
  'FRONLEICHNAM',
  'DEUTSCHEEINHEIT',
  'REFORMATIONSTAG',
  'ALLERHEILIGEN',
  'BUBETAG',
  'ERSTERWEIHNACHTSFEIERTAG',
  'ZWEITERWEIHNACHTSFEIERTAG',
];

const germanTranslations = {
  NEUJAHRSTAG: 'Neujahrstag',
  HEILIGEDREIKOENIGE: 'Heilige Drei Könige',
  KARFREITAG: 'Karfreitag',
  OSTERSONNTAG: 'Ostersonntag',
  OSTERMONTAG: 'Ostermontag',
  TAG_DER_ARBEIT: 'Tag der Arbeit',
  CHRISTIHIMMELFAHRT: 'Christi Himmelfahrt',
  PFINGSTSONNTAG: 'Pfingstsonntag',
  PFINGSTMONTAG: 'Pfingstmontag',
  FRONLEICHNAM: 'Fronleichnam',
  MARIAHIMMELFAHRT: 'Mariä Himmelfahrt',
  DEUTSCHEEINHEIT: 'Tag der Deutschen Einheit',
  REFORMATIONSTAG: 'Reformationstag',
  ALLERHEILIGEN: 'Allerheiligen',
  BUBETAG: 'Buß- und Bettag',
  ERSTERWEIHNACHTSFEIERTAG: '1. Weihnachtstag',
  ZWEITERWEIHNACHTSFEIERTAG: '2. Weihnachtstag',
  MONDAY: 'Montag',
  TUESDAY: 'Dienstag',
  WEDNESDAY: 'Mittwoch',
  THURSDAY: 'Donnerstag',
  FRIDAY: 'Freitag',
  SATURDAY: 'Samstag',
  SUNDAY: 'Sonntag',
};

const dayNames = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

/*******************************************************************************************************/
const errorHandler = function (node, err, messageText, stateText) {
  if (!err) {
    return true;
  }
  if (err.message) {
    let msg = err.message.toLowerCase();
    messageText += ':' + err.message;
  } else {
    messageText += '! (No error message given!)';
  }

  if (node) {
    node.error(messageText);
    node.debug(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    node.status({
      fill: "red",
      shape: "ring",
      text: stateText
    });
  } else if (console) {
    console.error(messageText);
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }
  return false;
}
/*******************************************************************************************************/
function getDataForDay(date, offsetToday, holidays) {
  if (offsetToday !== 0) {
    let d = new Date(date);
    d.setDate(d.getDate() + offsetToday);
    return getDataForDate(d, holidays, offsetToday);
  }
  return getDataForDate(date, holidays, 0);
}

// holidays api
/**
 * get the data for a date.
 * @param date date to get data for
 * @param holidays list of holidays
 * @param offsetToday (optional) 
 * @returns object of all information for the day
 */
function getDataForDate(date, holidays, offsetToday) {
  let d = date.getDay(); //gets the day of week
  //const internalDate = toUtcTimestamp(date);

  let result = _newDay(dayNames[d], date)
  if (offsetToday) {
    result.dayOffset = offsetToday;
  }

  result.holiday = holidays.objects.find(holiday => holiday.equals(date));
  result.isSunday = (result.dayOfWeek === 0);
  result.isSaturday = (result.dayOfWeek === 6);
  result.isHoliday = ((typeof result.holiday !== 'undefined') && (result.holiday != null)); // holidays.integers.indexOf(internalDate) !== -1
  result.name = germanTranslations[result.id];
  result.isWeekend = result.isSunday || result.isSaturday;
  result.isSunOrHoliday = result.isSunday || result.isHoliday;
  result.isWeekendOrHoliday = result.isSaturday || result.isSunday || result.isHoliday;

  /*
  //Brückentag?
  if (d === 5 && (typeof result.holiday !== 'undefined')) {
    //Freitag
    result.isBetweenHolidayAndSaturday = outMsg.payload.today.isHoliday

    holidays.objects.find(holiday => holiday.equals(date))

    ((typeof result.holiday !== 'undefined') && (result.holiday != null))
  } else {
    result.isBetweenHolidayAndSaturday = false;
  }

  if (d === 1 && (typeof result.holiday !== 'undefined')) {
    //Montag
    result.isBetweenSundayAndHoliday = outMsg.payload.today.isHoliday
  } else {
    result.isBetweenSundayAndHoliday = false;
  }/* */
  return result;
}

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  let dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

// holidays api
/**
 * Checks if the given holidayName is a valid {@link HolidayType}.
 * @param holidayName {@link HolidayType} to check
 * @throws {Error}
 * @private
 */
function checkHolidayType(holidayName) {
  if (holidayName === null || holidayName === undefined) {
    throw new TypeError('holidayName must not be null or undefined');
  }
  if (allHolidays.indexOf(holidayName) === -1) {
    throw new Error(
      'feiertage.js: invalid holiday type "' + holidayName + '"! Must be one of ' + allHolidays.toString()
    );
  }
}

function isSpecificHoliday(
  date,
  holidayName
) {
  checkHolidayType(holidayName);
  return holidays.objects.find(holiday => holiday.equals(date)) !== undefined;
}

/**
 *
 * @param year
 * @param region
 * @returns objects: Array,integers
 * @private
 */
function _getHolidaysOfYear(year, region) {
  const feiertageObjects = [
    _newHoliday('NEUJAHRSTAG', _makeDate(year, 1, 1)),
    _newHoliday('TAG_DER_ARBEIT', _makeDate(year, 5, 1)),
    _newHoliday('DEUTSCHEEINHEIT', _makeDate(year, 10, 3)),
    _newHoliday('ERSTERWEIHNACHTSFEIERTAG', _makeDate(year, 12, 25)),
    _newHoliday('ZWEITERWEIHNACHTSFEIERTAG', _makeDate(year, 12, 26)),
  ];

  const easter_date = getEasterDate(year);
  let karfreitag = new Date(easter_date.getTime());
  karfreitag = addDays(karfreitag, -2);
  let ostermontag = new Date(easter_date.getTime());
  ostermontag = addDays(ostermontag, 1);
  let christi_himmelfahrt = new Date(easter_date.getTime());
  christi_himmelfahrt = addDays(christi_himmelfahrt, 39);
  let pfingstsonntag = new Date(easter_date.getTime());
  pfingstsonntag = addDays(pfingstsonntag, 49);

  let pfingstmontag = new Date(easter_date.getTime());
  pfingstmontag = addDays(pfingstmontag, 50);

  feiertageObjects.push(_newHoliday('KARFREITAG', karfreitag));
  feiertageObjects.push(_newHoliday('OSTERMONTAG', ostermontag));
  feiertageObjects.push(_newHoliday('CHRISTIHIMMELFAHRT', christi_himmelfahrt));
  feiertageObjects.push(_newHoliday('PFINGSTMONTAG', pfingstmontag));

  // Heilige 3 Koenige
  if (
    region === 'BW' ||
    region === 'BY' ||
    region === 'ST' ||
    region === 'ALL'
  ) {
    feiertageObjects.push(
      _newHoliday('HEILIGEDREIKOENIGE', _makeDate(year, 1, 6))
    );
  }
  if (region === 'BB' || region === 'ALL') {
    feiertageObjects.push(_newHoliday('OSTERSONNTAG', easter_date));
    feiertageObjects.push(_newHoliday('PFINGSTSONNTAG', pfingstsonntag));
  }
  // Fronleichnam
  if (
    region === 'BW' ||
    region === 'BY' ||
    region === 'HE' ||
    region === 'NW' ||
    region === 'RP' ||
    region === 'SL' ||
    region === 'ALL'
  ) {
    let fronleichnam = new Date(easter_date.getTime());
    fronleichnam = addDays(fronleichnam, 60);
    feiertageObjects.push(_newHoliday('FRONLEICHNAM', fronleichnam));
  }

  // Maria Himmelfahrt
  if (region === 'SL' || region === 'BY') {
    feiertageObjects.push(
      _newHoliday('MARIAHIMMELFAHRT', _makeDate(year, 8, 15))
    );
  }
  // Reformationstag

  if (
    year === 2017 ||
    region === 'BB' ||
    region === 'MV' ||
    region === 'SN' ||
    region === 'ST' ||
    region === 'TH' ||
    region === 'ALL'
  ) {
    feiertageObjects.push(
      _newHoliday('REFORMATIONSTAG', _makeDate(year, 10, 31))
    );
  }

  // Allerheiligen
  if (
    region === 'BW' ||
    region === 'BY' ||
    region === 'NW' ||
    region === 'RP' ||
    region === 'SL' ||
    region === 'ALL'
  ) {
    feiertageObjects.push(_newHoliday('ALLERHEILIGEN', _makeDate(year, 11, 1)));
  }

  // Buss und Bettag
  if (region === 'SN' || region === 'ALL') {
    // @todo write test
    const bussbettag = getBussBettag(year);
    feiertageObjects.push(
      _newHoliday(
        'BUBETAG',
        _makeDate(
          bussbettag.getUTCFullYear(),
          bussbettag.getUTCMonth() + 1,
          bussbettag.getUTCDate()
        )
      )
    );
  }

  feiertageObjects.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return {
    objects: feiertageObjects,
    integers: generateIntegerRepresentation(feiertageObjects),
  };
}

/**
 *
 * @param objects
 * @returns {Array}
 * @private
 */
function generateIntegerRepresentation(objects) {
  return objects.map(holiday => toUtcTimestamp(holiday.date));
}

/**
 * Calculates the Easter date of a given year.
 * @param year {number}
 * @returns {Date} Easter date
 * @private
 */
function getEasterDate(year) {
  const C = Math.floor(year / 100);
  const N = year - 19 * Math.floor(year / 19);
  const K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I -= 30 * Math.floor(I / 30);
  I -=
    Math.floor(I / 28) *
    (1 -
      Math.floor(I / 28) *
      Math.floor(29 / (I + 1)) *
      Math.floor((21 - N) / 11));
  let J = year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4);
  J -= 7 * Math.floor(J / 7);
  const L = I - J;
  const M = 3 + Math.floor((L + 40) / 44);
  const D = L + 28 - 31 * Math.floor(M / 4);
  return new Date(year, M - 1, D);
}

/**
 * Computes the "Buss- und Bettag"'s date.
 * @param jahr {number}
 * @returns {Date} the year's "Buss- und Bettag" date
 * @private
 */
function getBussBettag(jahr) {
  const weihnachten = new Date(jahr, 11, 25, 12, 0, 0);
  const ersterAdventOffset = 32;
  let wochenTagOffset = weihnachten.getDay() % 7;

  if (wochenTagOffset === 0) wochenTagOffset = 7;

  const tageVorWeihnachten = wochenTagOffset + ersterAdventOffset;

  let bbtag = new Date(weihnachten.getTime());
  bbtag = addDays(bbtag, -tageVorWeihnachten);

  return bbtag;
}

/**
 * Adds {@code days} days to the given {@link Date}.
 * @param date
 * @param days
 * @returns {Date}
 * @private
 */
function addDays(date, days) {
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Creates a new {@link Date}.
 * @param year
 * @param naturalMonth month (1-12)
 * @param day
 * @returns {Date}
 * @private
 */
function _makeDate(year, naturalMonth, day) {
  return new Date(year, naturalMonth - 1, day);
}

/**
 *
 * @param id
 * @param date
 * @returns Holiday
 * @private
 */
function _newHoliday(id, date) {
  return {
    id,
    name: germanTranslations[id],
    dayOfWeek: date.getUTCDay(),
    day: date.getUTCDate(),
    month: date.getUTCMonth(),
    year: date.getUTCFullYear(),
    date, //: new Date(year, month, day, hours, minutes, seconds, milliseconds),
    dateString: _localeDateObjectToDateString(date),
    getNormalizedDate() {
      return toUtcTimestamp(this.date);
    },
    equals(date) {
      const string = _localeDateObjectToDateString(date);
      return this.dateString === string;
    },
  };
}

/**
 *
 * @param d
 * @param date
 * @returns day
 * @private
 */
function _newDay(id, date) {
  return {
    id,
    name: germanTranslations[id],
    dayOfWeek: date.getUTCDay(),
    day: date.getUTCDate(),
    month: date.getUTCMonth(),
    year: date.getUTCFullYear(),
    date, //: new Date(year, month, day, hours, minutes, seconds, milliseconds),
    dateString: _localeDateObjectToDateString(date),
  };
}

/**
 *
 * @param date
 * @returns {string}
 * @private
 */
function _localeDateObjectToDateString(date) {
  date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

/**
 *
 * @param date
 * @returns {object}
 * @private
 */
function _getlocaleDateObject(date) {
  date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/**
 * Returns the UTC timestamp of the given date with hours, minutes, seconds, and milliseconds set to zero.
 * @param date
 * @returns {number} UTC timestamp
 */
function toUtcTimestamp(date) {
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}


module.exports = function (RED) {
  function germanHolidaysNode(config) {
    RED.nodes.createNode(this, config);
    //var node = this;

    this.on('input', function (msg) {
      try {
        /********************************************
         * versenden:
         *********************************************/
        //var creds = RED.nodes.getNode(config.creds); - not used
        let attrs = ['region', 'day', 'date', 'ts'];

        var outMsg = {
          payload: {},
          topic: msg.topic,
          data: {},
        }

        for (let attr of attrs) {
          if (config[attr]) {
            outMsg.data[attr] = config[attr];
          }
          if (msg[attr]) {
            outMsg.data[attr] = msg[attr];
          }
        }

        /*
        if (typeof msg.payload === 'object') {
          for (let attr of attrs) {
            if (msg.payload[attr]) {
              outMsg.data[attr] = msg.payload[attr];
            }
          }
        }/* */
        if ((typeof outMsg.data.ts === 'undefined') && ((typeof msg.payload === 'string') || (msg.payload instanceof Date))) {
          let dto = new Date(msg.payload);
          if (dto !== "Invalid Date" && !isNaN(dto)) {
            outMsg.data.ts = dto;
          }
        }
        //-------------------------------------------------------------------

        if (typeof outMsg.data.region === 'undefined' || outMsg.data.region === '') {
          this.error("configuraton error: Region is missing!");
          this.status({
            fill: "red",
            shape: "dot",
            text: "No Region given!"
          });
          return;
        }
        outMsg.data.region = outMsg.data.region.toUpperCase();
        if (allRegions.indexOf(outMsg.data.region) === -1) {
          this.error('Invalid region: ' + outMsg.data.region + '! Must be one of ' + allRegions.toString());
          this.status({
            fill: "red",
            shape: "dot",
            text: "Invalid Region given!"
          });
          return;
        }

        if ((typeof outMsg.data.date !== 'undefined') && ((outMsg.data.date instanceof Date) || (typeof outMsg.data.date === 'string'))) {

          let dto = new Date(outMsg.data.date);
          if (dto !== "Invalid Date" && !isNaN(dto)) {
            outMsg.ts = dto;
            outMsg.data.year = dto.getFullYear();
            const holidays = _getHolidaysOfYear(outMsg.data.year, outMsg.data.region);
            outMsg.payload = getDataForDate(dto, holidays);
            this.send(outMsg);
            return;
          }
        }

        if (typeof outMsg.data.ts === 'string') {
          let dto = new Date(outMsg.data.ts);
          if (dto !== "Invalid Date" && !isNaN(dto)) {
            outMsg.data.ts = dto;
          }
        }

        if ((typeof outMsg.data.ts === 'undefined') || !(outMsg.data.ts instanceof Date)) {
          outMsg.data.ts = new Date();
        }

        outMsg.ts = outMsg.data.ts;
        outMsg.data.year = outMsg.data.ts.getFullYear();
        const holidays = _getHolidaysOfYear(outMsg.data.year, outMsg.data.region);

        if (typeof outMsg.data.day !== 'undefined' || !isNaN(outMsg.data.day)) {
          outMsg.payload = getDataForDay(outMsg.data.ts, outMsg.data.day, holidays);
          this.send(outMsg);
          return;
        }

        outMsg.payload = {
          //lastUpdate: outMsg.data.ts.toISOString(),
          yesterday: {},
          today: {},
          tomorrow: {},
          dayAfterTomorrow: {},
          afterTheDayAfterTomorrow: {},
          hollidays: holidays.objects,
          hollidaysNum: holidays.integers,
          next: {},
          weekNumber: getWeekNumber(outMsg.data.ts)
        };

        outMsg.payload.yesterday = getDataForDay(outMsg.data.ts, -1, holidays);
        outMsg.payload.today = getDataForDate(outMsg.data.ts, holidays, 0); //getDataForDay(outMsg.data.ts, 0, holidays);
        outMsg.payload.tomorrow = getDataForDay(outMsg.data.ts, 1, holidays);
        outMsg.payload.dayAfterTomorrow = getDataForDay(outMsg.data.ts, 2, holidays);
        outMsg.payload.afterTheDayAfterTomorrow = getDataForDay(outMsg.data.ts, 3, holidays);

        outMsg.payload.weekNumberEven = !Boolean(outMsg.payload.weekNumber % 2);

        //Brückentag?
        outMsg.payload.today.isBetweenSundayAndHoliday = (outMsg.payload.yesterday.isSunday && outMsg.payload.tomorrow.isHoliday);
        outMsg.payload.tomorrow.isBetweenSundayAndHoliday = (outMsg.payload.today.isSunday && outMsg.payload.dayAfterTomorrow.isHoliday);
        outMsg.payload.dayAfterTomorrow.isBetweenSundayAndHoliday = (outMsg.payload.tomorrow.isSunday && outMsg.payload.afterTheDayAfterTomorrow.isHoliday);

        outMsg.payload.today.isBetweenHolidayAndSaturday = (outMsg.payload.yesterday.isHoliday && outMsg.payload.tomorrow.isSaturday);
        outMsg.payload.tomorrow.isBetweenHolidayAndSaturday = (outMsg.payload.today.isHoliday && outMsg.payload.dayAfterTomorrow.isSaturday);
        outMsg.payload.dayAfterTomorrow.isBetweenHolidayAndSaturday = (outMsg.payload.tomorrow.isHoliday && outMsg.payload.afterTheDayAfterTomorrow.isSaturday);

        outMsg.payload.today.isBetweenWeekendOrHoliday = (outMsg.payload.yesterday.isWeekendOrHoliday && outMsg.payload.tomorrow.isWeekendOrHoliday && !outMsg.payload.today.isWeekendOrHoliday);
        outMsg.payload.tomorrow.isBetweenWeekendOrHoliday = (outMsg.payload.today.isWeekendOrHoliday && outMsg.payload.dayAfterTomorrow.isWeekendOrHoliday && !outMsg.payload.tomorrow.isWeekendOrHoliday);
        outMsg.payload.dayAfterTomorrow.isBetweenWeekendOrHoliday = (outMsg.payload.tomorrow.isWeekendOrHoliday && outMsg.payload.afterTheDayAfterTomorrow.isWeekendOrHoliday && !outMsg.payload.dayAfterTomorrow.isWeekendOrHoliday);

        for (let i = 0; i < outMsg.payload.hollidays.length; i++) {
          let hd = outMsg.payload.hollidays[i];
          let d = hd.date;

          var timeDiff = d.getTime() - outMsg.ts.getTime();
          if (timeDiff > 0) {
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            outMsg.payload.next.holliday = hd;
            outMsg.payload.next.hollidayDiff = diffDays;
            break;
          }
        }

        //0 S 1 M 2 D 3 M 4 D 5 F 6 S 0 S
        outMsg.payload.next.weekendDayDiff = (6 - outMsg.payload.today.dayOfWeek);
        if (outMsg.payload.today.dayOfWeek === 6) {
          let date = new Date(outMsg.data.ts);
          date.setDate(date.getDate() + 1);
          outMsg.payload.next.weekendDay = _newDay('SUNDAY', date);
        } else {
          let dayOfWeek = 6; //saturday
          let date = new Date(outMsg.data.ts);
          let diff = date.getDay() - dayOfWeek;
          if (diff > 0) {
            date.setDate(date.getDate() + 6);
          } else if (diff < 0) {
            date.setDate(date.getDate() + ((-1) * diff))
          }
          outMsg.payload.next.weekendDay = _newDay('SATURDAY', date);
        }

        outMsg.payload.next.weekendOrHolidayDiff = (outMsg.payload.next.hollidayDiff) ? Math.min(outMsg.payload.next.hollidayDiff, outMsg.payload.next.weekendDayDiff) : outMsg.payload.next.weekendDayDiff;
        if (outMsg.payload.next.holliday && (outMsg.payload.next.weekendOrHolidayDiff == outMsg.payload.next.hollidayDiff)) {
          outMsg.payload.next.weekendOrHoliday = outMsg.payload.next.holliday;
        } else {
          outMsg.payload.next.weekendOrHoliday = outMsg.payload.next.weekendDay;
        }
        this.send(outMsg);
      } catch (err) {
        errorHandler(this, err, 'Exception occured on get german holidays', 'internal error');
      }
    });
  }

  RED.nodes.registerType('german-holidays', germanHolidaysNode);
};