const request = require('request');

// getURLData
// async function to get data from URL using request
const getURLData = async (visitUrl, data) => {
    return new Promise((resolves, rejects) => {
        request({
            url: visitUrl,
            method: 'GET',
            followAllRedirects: true
        }, (error, response, body) => {
            if (error) {
                console.log(error);
                rejects();
                throw new Error(error);
            } else {
                response.setEncoding('binary');
                data = JSON.stringify(response.request._redirect.redirects);
                resolves(data);
            };
        });
    });
};

module.exports = getURLData;