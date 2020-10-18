# simple-apm-express

[![Build Status:](https://github.com/Kareem-Emad/simple-apm-express/workflows/Build/badge.svg)](https://github.com/Kareem-Emad/simple-apm-express/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

express sdk for simple apm server, collects anlaytics for your endpoints/services and make them avaiable nearly realtime for analysis

<github.com/Kareem-Emad/simple-apm>

## How to use

first make sure you set up the env variable properlly for:

- `JWT_SECRET` the secret key used to sign tokens for apm service, should be same env as the service itself

- `APM_SERVER_URL` the base url of the hosted apm service

```js
const simpleAPMClient = require('simple-apm-express');
simpleAPMClient.attachAPM(app, 'service_name', logger)
```

params in order:

- `app` express app object
- `service` name of the current service that will be recorded in apm
- `logger` logger object if any to direct errors to your configured logger

### Endpoints

you can find a list of all https requests made on your server, their response time, status code and http method listed in the route `/apm/stats`

for more detailed anlaytics, check out the apm server itself <github.com/Kareem-Emad/simple-apm>
