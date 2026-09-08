# Create the backend

*Note*: Most of the stuff we did here is explained in the last section.

> npm init -y

Mongoose is the library used to interact with MongoDB from Node.js applications.
> npm i express@4.19.2 mongoose@8.5.1 body-parser@1.20.2 --save-exact

In `package.json` add the following:
> "scripts": {
>   "start": "node src/server.js"
> }

> npm i --save-exact --save-dev nodemon@3.1.4

Only execute the instructions from a certain stage (here: development)
> docker build -t notes-backend:dev --target=development .

> docker build -t notes-backend:prod --target=production .

We can use the target in the compose.yml as well.
```
services:
  notes:
    build:
      context: .
      dockerfile: Dockerfile
      # This will execute only the development stage from the Dockerfile.
      target: development
```

We use this to perform sychronous API requests between Notebooks and Notes.
> npm i --save-exact axios@1.7.2