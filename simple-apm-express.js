var responseTime = require('response-time')
const jwt = require('jsonwebtoken');
const request = require('request');
const fs = require('fs');

const SWITCH_JWT_SECRET = process.env.JWT_SECRET || 'my_little_secret';
const APM_SERVER_URL = process.env.APM_SERVER_URL || 'http://localhost:5000/requests';

/**
 * @function {generateToken}
 * @summary signs a new token with the switch service key
 * @param author (string) identifying string of this service or author of the request
 * @returns {string} generates signed jwt token to verify identity with switch service
 */
const generateToken = function (author) {
    return jwt.sign({ Author: author }, SWITCH_JWT_SECRET);
};

/**
 * @function {attachAPM}
 * @summary attaches a listner for request start/end to record response time and send it to apm server
 * @param app (Express) app server object
 */
const attachAPM = function (app, service_name, logger) {
    const logFilePath = './apm_log.txt'

    app.get('/apm/stats', function (req, res) {
        res.sendfile(logFilePath);
    })

    app.use(responseTime(function (req, res, time) {

        const body = { 
            "url": `http://${req.headers.host}${req.url}`,
            "http_method": req.method,
            "response_time": time,
            "service_name": service_name,
            "status_code": res.statusCode,
            "created_at": new Date().toISOString().replace('T', ' ').substring(0, 19)
        }

        const options = {
            method: 'POST',
            url: APM_SERVER_URL,
            headers: {
                Authorization: `Bearer ${generateToken(req.headers.host)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        request(options, function (error) {
            if (error){ 
                if (logger) {
                    logger.error(`[SIMPLE_APM] Failed to communicate with upstream apm server ${error}`)
                }
            }
        });


        const request_info = `${body.http_method} ${body.url} | code: ${body.status_code} | time(ms): ${body.response_time}\n`
        fs.appendFile(logFilePath, request_info, function (err) {
            if (err) {
                if (logger) {
                    logger.error(`[SIMPLE_APM] Failed to write logged request to disk | ${err}`)
                }
            }
        });
    }))
};

module.exports = [
    attachAPM,
]
