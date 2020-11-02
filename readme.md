# ITS Base API
---
## Install
### Create .env file and set needed environment variables
```
NODE_ENV=dev
```

### Set needed variables in config files
> also for PM2, set needed variables in config file *ecosystem.config.js*

### Install API dependecies
```
$ npm i
```
---
## Run
### Runs the API in developer/watch mode
```
$ npm run dev
```

### Runs the API using default node.js install
```
$ npm run start
```

### Run the API in QA server using PM2
```
$ npm run qa
```

### Run the API in Prod server using PM2
```
$ npm run prod
```
---
## Utils
### Restart API using PM2
```
$ npm run restart
```

### Check API logs (last 100 lines) using PM2
```
$ npm run logs
```
---
Postman collection must be added inside .postman directory
