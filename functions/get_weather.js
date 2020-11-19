// Simple Nodejs program to pull top 100 cryptocurrencies from the Coinranking Public API
// Run: node data.js
'use strict';

const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const encoding_f = require('encoding');

// Set request parameters here, specifically to use the heroku passthrough
// Add CLI functionality and more parameters in the future
const encoding = 'UTF-8';
const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language' : 'en-US, en;q=0.5',
    'DNT' : '1',
    'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
    'X-Requested-With' : Math.random(),
    'origin': Math.random()
};

// getWeather - async
// await request to retrieve weather points
// return current, high, low as object
const weather_request = async (code) => {
    let weatherURL = `https://cors-anywhere.herokuapp.com/https://www.yahoo.com/news/weather/united-states/new-york/new-york-${code}`;
    let weather_object  = {};
    await rp({ url: weatherURL, headers: headers, encoding: null }, (error, html) => {
        const $ = cheerio.load(encoding_f.convert(html.body, encoding).toString('utf8'), encoding);
        let string_t = JSON.stringify($('.now > span').first().contents().text()).replace('"','').replace('"','') + '°';
        let string_h = JSON.stringify($('.high-low > span').first().contents().text()).replace('"','').replace('"','');
        let string_l = JSON.stringify($('.high-low > span').last().contents().text()).replace('"','').replace('"','');
        weather_object = {
            current: string_t,
            high: string_h,
            low: string_l
        };
    }).then(() => {
        return;
    });
    return weather_object;
};

module.exports = weather_request;