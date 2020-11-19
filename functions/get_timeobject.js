const { DateTime } = require('luxon');

// getCurrentTimeObject
// Returns current time for browser in ISO 
const getCurrentTimeObject = (time) => {
  return new Promise((resolves, rejects) => {
    try {
      const time = new Date(Date.now()).toISOString();
      const browsertime = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const converted = DateTime.fromISO(time, { zone: browsertime });

      // Create time object to strong value returned from Luxon
      let timeObject =  converted.c
      let year = String(converted.c.year).length > 1 ? converted.c.year : '0' + converted.c.year;
      let month = String(converted.c.month).length > 1 ? converted.c.month : '0' + converted.c.month;
      let day = String(converted.c.day).length > 1 ? converted.c.day : '0' + converted.c.day;
      let hour = String(converted.c.hour).length > 1 ? converted.c.hour : '0' + converted.c.hour;
      let minute = String(converted.c.minute).length > 1 ? converted.c.minute : '0' + converted.c.minute;
      let second = String(converted.c.second).length > 1 ? converted.c.second : '0' + converted.c.second;

      let timeData = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second
      };
      resolves(timeData);
    } catch(error) {
      rejects(error);
    };
  });
};

module.exports = getCurrentTimeObject;
