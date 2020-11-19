'use strict';

require('dotenv').config();

const Router = require('express-promise-router');
const router = new Router();

const getData = require('./data.js');
const getWeather = require('./functions/get_weather.js');
const getCrypto = require('./functions/get_crypto.js');
const getURLData = require('./functions/get_urldata.js');
const getCurrentTimeObject = require('./functions/get_urldata.js');
// GET - /
// Shows current time
router.get('/', (req, res, next) => {
  let time = getCurrentTimeObject();
  res.send(time);
  next();
});

router.get('/weather', (req, res, next) => {
  let user_weather_code = req.query.location;
  const getWeatherData = async (weathercode) => {
    let weather = await getWeather(weathercode);
    res.send(weather);
    morgan(':method :url :status :res[content-length] - :response-time ms');
    next();
    return;
  };
  getWeatherData(user_weather_code);
});

router.get('/crypto', (req, res, next) => {
  let number_of_coins = req.query.number;
  const getCryptoData = async (coins) => {
    let crypto = await getCrypto(coins);
    res.send(crypto);
    next();
    return;
  };
  getCryptoData(number_of_coins);
});

// GET - /trace
// returns current time in your timezone as object
router.get('/trace', (req, res, next) => {
  res.render('trace_page');
  next();
});

// POST - /trace
// post URL to trace
router.post('/trace', (req, res, next) => {
  const pageToVisit = String(req.body.tracedPage).trim();
  const formattedPage = (pageToVisit.indexOf('http://') !== -1 || pageToVisit.indexOf('https://') !== -1) ? pageToVisit : 'http://' + pageToVisit;
  // Validate pageToVisit to ensure it's a properly constructed URL.
  // Else send invalid URL response.
  if(formattedPage.indexOf(' ') <= 0 ){
    const parsedurl = url.parse(formattedPage);
    const tracer = async () => {
        let traceData = await getURLData(parsedurl);
        let parsedData = JSON.stringify(traceData)
        let formattedData = parsedData.replace("[","").replace("]","");
        return formattedData;
    };
    const render = async () => {
        let traceData = await tracer();
        return res.render('traced_page', { traceData: traceData });
    };
    render();
    next();
  } else {
    return res.render('traced_page_error');
    next();
  };
  return;
});

module.exports = router;