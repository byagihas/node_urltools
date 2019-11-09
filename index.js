'use strict';

const fs = require('fs')
const path = require('path')
const url = require('url')

const ejs = require('ejs')
const helmet = require('helmet')
const compress = require('compression')

const http = require('http')
const express = require('express')
const morgan = require('morgan')
const Crawler = require('crawler')
const request = require('request')

const app = express()
 
app.use(morgan('combined'))

app.get('/', (req, res, err) => {
    // load views
    let pageToVisit = "http://www.arstechnica.com?id=1";
    let parsedurl = url.parse(pageToVisit)
    let query = parsedurl.query

    console.log("Visiting page " + pageToVisit);
    request(pageToVisit, function(error, response, body) {
       if(error) {
         console.log("Error: " + error);
       }
       // Check status code (200 is HTTP OK)
       console.log("Status code: " + response.statusCode);
       if(response.statusCode === 200) {
         // Parse the document body
    
       }
       
       console.log(req.query.id)
       console.log(query)
    });
})

app.post('/post', (req, res, err) => {

    let theory = {
        id: '0',
        title: req.body['title'],
        content: req.body['content'],
        category: req.body['category'],

        timer: '0',
        truthCount: 0,
        falseCount: 0
    }
    
    console.log(post)

})



app.listen('8080', 'localhost', () => {
    console.log('server running')
 })