const request = require('request');

// getURLData
// async function to get data from URL using request
const getURLData = (visitUrl, data) => {
    return new Promise((resolves, rejects) => {
      try {
        request({
          url: visitUrl,
          method: 'GET',
          followAllRedirects: true
        }, (error, response) => {
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
      } catch(err) {
        rejects(err);
      };
    });
};

module.exports = getURLData;