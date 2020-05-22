// Simple Nodejs program to pull top 100 cryptocurrencies from the Coinranking Public API
// Run: node data.js
'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const encoding_f = require('encoding');

let { promisify } = require('util');
let writeFile = promisify(fs.writeFile);

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

// Request top 100 Cryptocurrencies in the last seven days from Coinranking Public API
const getCrypto = async (limit) => {
    const fiatType = 'USD';
    const lookbackWindow = '7d';
    const numberOfCoins = limit;
    let crypto_object = {};
    await rp(`https://api.coinranking.com/v1/public/coins?base=${fiatType}&timePeriod=${lookbackWindow}&limit=${numberOfCoins}`, (error, res) => {
        if (error) throw error;
        // Create responsebody and crypto objects to parse then store the cryptocurrency data
        let responsebody = JSON.parse(res.body);
        crypto_object = responsebody.data.coins;
        console.log('Data ingested');
    }).then(() => {
        // Write JSON file
        fs.writeFile('./coinranking.json', JSON.stringify(crypto_object), (err) => {
            if (err) throw err;
            console.log('JSON file saved:' + __dirname + '/coinranking.json');
        });
        return;
    });
    return crypto_object;
};

// getFirstItemFromSelector
const getFirstItemFromSelector = async (url, tag) => {
    let arr = [];
    await rp({ url: url, headers : headers, encoding: null }, (error, html) => {
        if (error) { console.log('Error requesting page'); throw error };
        let first_item = '';
        let body_encoded = encoding_f.convert(html.body, encoding);
        const $ = cheerio.load(body_encoded.toString('utf8'), 'UTF-8');
        arr.push(JSON.stringify($(tag).contents().first().text()));
        console.log(arr[0]);
    }).then(() => {
        return;
    });
    return arr[0];
};
// getWeather
const getWeather = async (code) => {
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
// program driver, in the future will use this as a formatting function
const driver = async (weathercode) => {
    //let test = await getData(10);
    let weather_test = await getWeather(weathercode);
    return weather_test;
};

module.exports = driver;