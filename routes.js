router.get('/', (req, res, err) => {

    res.header('Content-Type', 'text/html');
    const time = new Date(Date.now()).toISOString()
    const browsertime = Intl.DateTimeFormat().resolvedOptions().timeZone 
    const converted = DateTime.fromISO(time, { zone: browsertime });
   
    let year = converted.c.year
    let month = converted.c.month
    let day = converted.c.day
    let hour = converted.c.hour
    let minute = converted.c.minute
    let seconds = converted.c.second

    console.log(time)
    console.log(converted.c.year)

    var interval_id = setInterval(function() {
        res.send(
            '<html><head></head><body><div style=\'text-align:center;font-size:32px;padding:1em;\'>Your current time is:<br/><br/>'
            + year  + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + seconds 
            + '</div></body></html>')
    }, 50);

    req.socket.on('close', function() {
      clearInterval(interval_id);
    });

    if(err) throw err
})

router.post('/trace', (req, res, err) => {

    // load views
    const pageToVisit = req.body.tracedPage
    const parsedurl = url.parse(pageToVisit)
    const query = parsedurl.query

    let theory = {
      id: '0',
      title: req.body['title'],
      content: req.body['content'],
      category: req.body['category'],

      timer: '0',
      truthCount: 0,
      falseCount: 0
    }
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
    });

    if(err) throw err
})

module.exports = router;