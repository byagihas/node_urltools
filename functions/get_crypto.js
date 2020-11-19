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
        return;
    });
    return crypto_object;
};

module.exports = getCrypto;