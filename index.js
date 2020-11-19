'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const url = require('url');
const cors = require('cors');
const ejs = require('ejs');

const helmet = require('helmet');
const compression = require('compression');
const { http, https } = require('follow-redirects');
const morgan = require('morgan');

const express = require('express');
const Crawler = require('crawler');
const request = require('request');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const { DateTime } = require('luxon');

// Data functions
const routes = require('./routes.js');

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

app.use(routes);
// Listen
app.listen(process.env.PORT, process.env.SERVER, () => {
    console.log(`server running on ${process.env.PORT}`);
});