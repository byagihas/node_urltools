'use strict';

require('dotenv').config();

const Router = require('express-promise-router');
const url = require('url');
const router = new Router();

//const getData = require('./data.js');
const getWeather = require('./functions/get_weather.js');
const getCrypto = require('./functions/get_crypto.js');
const getURLData = require('./functions/get_urldata.js');
const getCurrentTimeObject = require('./functions/get_timeobject.js');
// GET - /
// Shows current time
router.get('/', (req, res, next) => {
  let getTime = async () => {
    try {
      let time = await getCurrentTimeObject();
      return time;
    } catch (err) {
      console.log(err);
      return res.render('index_error');
    }
  }

  let render = async () => {
    try {
      let timeData = await getTime();
      return res.render('index', {
        year: timeData.year,
        month: timeData.month,
        day: timeData.day,
        hour: timeData.hour,
        minute: timeData.minute,
        second: timeData.second
      });
    } catch (err) {
      console.log(err);
      return res.render('index_error');
    }
  }
  render();
});

router.get('/weather', (req, res, next) => {
  let user_weather_code = req.query.location;
  const getWeatherData = async (weathercode) => {
    let weather = await getWeather(weathercode);
    res.send(weather);
    morgan(':method :url :status :res[content-length] - :response-time ms');
    next();
  };
  getWeatherData(user_weather_code);
});

router.get('/crypto', (req, res, next) => {
  let number_of_coins = req.query.number;
  const getCryptoData = async (coins) => {
    let crypto = await getCrypto(coins);
    res.send(crypto);
    next();
  };
  getCryptoData(number_of_coins);
});

router.get('/dashboard', (req, res, next) => {
  const getWeatherData = async () => {
    let weather = await getWeather('2379574');
    res.send(weather);
    next();
  };
  getWeatherData();
});

// GET - /trace
// returns current time in your timezone as object
router.get('/trace', (req, res, next) => {
  res.render('trace_page');
  next();
});

// POST - /trace
// post URL to trace
router.post('/trace', (req, res) => {
  const pageToVisit = String(req.body.tracedPage).trim();
  // Validate pageToVisit to ensure it's a properly constructed URL.
  // Else send invalid URL response.
  if (pageToVisit.indexOf(' ') < 1 && pageToVisit.match(process.env.URLREGEX) != null) {
    const parsedurl = url.parse(pageToVisit);
    console.log(parsedurl);

    const tracer = async () => {
      return getURLData(parsedurl, (result) => {
        let parsedData = JSON.stringify(result);
        formattedData = parsedData.replace("[", "").replace("]", "");
      }).then((formattedData) => {
        return formattedData;
      });
    };

    const render = async () => {
      try {
        let traceData = await tracer();
        return res.render('traced_page', {
          traceData: traceData
        });
      } catch (err) {
        console.log(err);
        return res.render('traced_page_error');
      };
    };

    render();
  } else {
    return res.render('traced_page_error');
  };
});

module.exports = router;