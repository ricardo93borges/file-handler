# File Handler

This is an application built with Express to upload files.

### Features

- **File upload**: The upload is handled by [Multer](https://www.npmjs.com/package/multer) module. It process concurrently 5 files of 50MB each, a cache manager service is used to keep track of the quantity of files being processed.
- **Rate limit**: Rate limit control is done using [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) middleware. The default values is 1 request allowed every 10 seconds.
- **Authentication**: There is also a basic authentication middleware, the credentials are hard coded because this app does not have a complete register/login feature.

## Dependencies

- Docker
- NodeJS 16

## How to run the tests

1. Run `npm test` inside the project folder

## How to run

### With Docker

1. rename `.env.sample` to `.env`. (optional, the app will use the default values if you skip this step)
2. Build: `docker build -t file-handler .`
3. Run: ` docker run -p 3000:3000 file-handler`

### Without Docker

1. rename `.env.sample` to `.env`. (optional, the app will use the default values if you skip this step)
2. npm run build
3. npm start

## How to use

1. Import the postman collection located in the root dir (`file_handler.postman_collection`)
2. After imported there will be 2 endpoints the first for **health check** and the second for **file upload**
   in which is necessary to select a file in the `Body` tab. Both endpoints already have the credentials configured.

## Resources

Postman collection `file_handler.postman_collection` in the root directory
