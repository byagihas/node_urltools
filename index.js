'use strict';

const fs = require('fs')
const path = require('path')
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

/*
app.get('/urltrace', (req, res) => {

    const r = request.get('https://www.nerdwallet.com/redirect/credit-cards/3098?name=Chase-Sapphire-Preferred&clickHeader_category=Credit%20Card&clickHeader_productId=3098&finish_type=external_application_referral&has_prequalified=false&impression_id=&link_type=APPLY_NOW_BUTTON&monetizable=YES_ASSUMED&page_number=&product_display_driver=&product_position=1&section_name=MonthlyBest&section_position=1&header_pageViewId=a3dad6d9-8ba0-4934-b451-fccec4de9178&clickHeader_productSlug=Chase-Sapphire-Preferred&clickHeader_productLocation=cc_product_card&clickHeader_productInstance=Chase-Sapphire-Preferred&clickHeader_linkType=APPLY_NOW_BUTTON&clickHeader_productPosition=1&clickHeader_sectionPosition=1&clickHeader_offerVersionId=132256&clickHeader_pageNumber=&clickHeader_impressionId=23249699-4866-4482-a916-1c18f429e1bc&pos=1&source_url=https%3A%2F%2Fwww.nerdwallet.com%2Fthe-best-credit-cards%3Ftrk_copy%3Dhpbestcc')
    console.log(r.uri.pathname);
    
    res.send(r.uri.pathname)
    
    // Queue URLs with custom callbacks & parameters
    c.queue([{
        uri: 'http://parishackers.org/',
        jQuery: false,
     
        // The global callback won't be called
        callback: function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                console.log('Grabbed', res.body.length, 'bytes');
            }
            done();
        }
    }]);
     
}) */

app.listen('8080', 'localhost', () => {
    console.log('server running')
 })