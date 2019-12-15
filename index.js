'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const cors = require('cors');

const ejs = require('ejs');
const helmet = require('helmet');
const compression = require('compression');
const { http, https } = require('follow-redirects');

const express = require('express');
const morgan = require('morgan');
const Crawler = require('crawler');
const request = require('request');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

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
    payment: ['coinbae.co'],
    syncXhr: ["none'"]
  }
}));

// Compression and content, Body parser, content paths
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// GET - /
app.get('/', (req, res, err) => {
    // Set headers for Cross Origin calls
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Content-Type', 'application/json');
    const time = new Date(Date.now()).toISOString();
    const browsertime = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const converted = DateTime.fromISO(time, { zone: browsertime });

    // Create time object to strong value returned from Luxor
    let timeObject = JSON.stringify(converted.c)
    let year = converted.c.year
    let month = converted.c.month
    let day = converted.c.day
    let hour = converted.c.hour
    let minute = converted.c.minute
    let seconds = converted.c.second

    console.log(timeObject);
    res.send(timeObject);
    res.end();
});

app.get('/trace', (req, res, err) => {
    res.render('index');
    res.end();
});

app.post('/trace', (req, res, err) => {
    const pageToVisit = req.body.tracedPage;
    const parsedurl = url.parse(pageToVisit);

    let tracer = async () => {
      let traceData = await getURLData(parsedurl);
      return traceData;
    }
    
    let render = async () => {
      let traceData = await tracer();
      return res.render('trace', { traceData: traceData });
    }
    render();

});

let getURLData = async (visitUrl, data) => {
    return new Promise((resolve, reject) => {
      request({
        url: visitUrl,
        method: 'GET',
        followAllRedirects: true
      }, function(error, response) {
          if (error) {
              console.log(error);
              reject();
          } else {
              let data = JSON.stringify(response.request._redirect.redirects);
              console.log(data);
              resolve(data);
          }
      });
    })
};

app.listen('8080', 'localhost', () => {
    console.log('server running on 8080')
});

/*let theory = {
id: '0',
title: req.body['title'],
content: req.body['content'],
category: req.body['category'],

timer: '0',
truthCount: 0,
falseCount: 0
}*/

/*
var interval_id = setInterval(function() {
    res.send(
      '<html><head></head><body><div style=\'text-align:center;font-size:32px;padding:1em;\'>Your current time is:<br/><br/>'
      + year  + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + seconds 
      + '</div></body></html>')
  }, 50);

req.socket.on('close', function() {
  clearInterval(interval_id);
});*/