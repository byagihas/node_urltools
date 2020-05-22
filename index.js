'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const cors = require('cors');
const ejs = require('ejs');
const getWeather = require('./data.js');

const helmet = require('helmet');
const compression = require('compression');
const { http, https } = require('follow-redirects');

const express = require('express');
const morgan = require('morgan');
const Crawler = require('crawler');
const request = require('request');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const { DateTime } = require('luxon');

const app = express();
 
app.use(morgan('combined'));
app.enable('trust proxy'); // Use for reverse proxy with nginx
app.set('view engine', 'ejs');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply limiter to all requests
app.use(limiter);

// Use Helmet
app.use(helmet())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.use(helmet.featurePolicy({
  features: {
    fullscreen: ["'self'"],
    vibrate: ["'none'"],
    payment: ["'none'"],
    syncXhr: ["none'"]
  }
}));

// Compression and content, Body parser, content paths
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lessMiddleware(__dirname + '/views'));
app.use(express.static(__dirname + '/views'));

// GET - /
// Shows current time
app.get('/', (req, res) => {
      let getTime = async() => {
        try{
            let time = await getCurrentTimeObject();
            return time;
        } catch(err) {
            console.log(err);
            return res.render('index_error');
        }
      }

      let render = async() => {
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
        } catch(err){
          console.log(err);
          return res.render('index_error');
        }
      }
      render();
});

app.get('/dashboard', (req, res, next) => {
    const getWeatherData = async () => {
      let weather = await getWeather('2379574');
      res.send(weather);
    };
    getWeatherData();
});

// GET - /trace
// returns current time in your timezone as object
app.get('/trace', (req, res) => {
    res.render('trace_page');
});

// POST - /trace
// post URL to trace
app.post('/trace', (req, res) => {
      const pageToVisit = String(req.body.tracedPage).trim();
      const formattedPage = (pageToVisit.indexOf('http://') !== -1 || pageToVisit.indexOf('https://') !== -1) ? pageToVisit : 'http://' + pageToVisit;
      // Validate pageToVisit to ensure it's a properly constructed URL.
      // Else send invalid URL response.
      if(formattedPage.indexOf(' ') <= 0 ){
        const parsedurl = url.parse(formattedPage);
        let tracer = async () => {
          try {
              let traceData = await getURLData(parsedurl);
              let parsedData = JSON.stringify(traceData)
              let formattedData = parsedData.replace("[","").replace("]","");
              return formattedData;
          } catch(err) {
            console.log(err);
            return res.render('traced_page_error');
          };
        };
        let render = async () => {
          try {
              let traceData = await tracer();
              return res.render('traced_page', { traceData: traceData });
          } catch(err) {
              console.log(err);
              return res.render('traced_page_error');
          };
        };
        render(); 
      } else {
        return res.render('traced_page_error');
      };
});

// Listen
app.listen('8080', 'localhost', () => {
    console.log('server running on 8080')
});


// FUNCTIONS
//-------------------------------------------------------------------------------//

// getURLData
// async function to get data from URL using request
let getURLData = async (visitUrl, data) => {
  try {
    return new Promise((resolves, rejects) => {
        request({
            url: visitUrl,
            method: 'GET',
            followAllRedirects: true
        }, (error, response, body) => {
            if (error) {
                console.log(error);
                rejects();
                throw error;
            } else {
                response.setEncoding('binary');
                data = JSON.stringify(response.request._redirect.redirects);
                resolves(data);
            }
        });
    })
  } catch(err) {
      console.log(err);
      return;
  }
};

// getCurrentTimeObject
// Returns current time for browser in ISO 
let getCurrentTimeObject = async (time) => {
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
  
      let toIso = (year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second);
      
      let timeData = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second
      }
      
      resolves(timeData);
    } catch {
      rejects();
    }
  });
};
