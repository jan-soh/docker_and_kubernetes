We have created a startup and teardown script for the mongo DB container.
To run the container use:
> ./start-db.sh

This will also create the required volume and network which will be done in the `setup.sh` script.
Variables used in these scripts are defined in the `.env.*` files.

To stop and remove the container as well as the volume and network use:
> ./cleanup-db.sh
 
# Other useful commands:
Run mongo db:
> docker run -d --name mongodb mongodb/mongodb-community-server:7.0-ubuntu2204

Run mongo shell (to perform mongo commands):
> docker exec -it mongodb mongosh

For instance:
> show dbs 
 
> use admin;

> show collections;

Create a startup and teardown script from console:
> touch start-db.sh

> chmod +x start-db.sh

> touch cleanup-db.sh

> chmod +x cleanup-db.sh

Connecting to MongoDB from a Docker container
> docker run --rm --name debugsh -it --network key-value-net \\\
>    mongodb/mongodb-community-server:7.0-ubuntu2204 \\\
>    mongosh \\\
>    mongodb://[user-name]:[password]@[container-name]/key-value-db

E.g.:
> docker run --rm --name debugsh -it --network key-value-net \\
> mongodb/mongodb-community-server:7.0-ubuntu2204 \\
> mongosh \\
> "mongodb://key-value-user:key-value-password@mongodb/key-value-db"

# Create the backend
> cd backend

> npm init -y

Mongoose is the library used to interact with MongoDB from Node.js applications.
> npm i express@4.19.2 mongoose@8.5.1 body-parser@1.20.2 --save-exact

In `package.json` add the following:
> "scripts": {
>   "start": "node src/server.js"
> }

Test the backend:
> npm start

Containerize the backend:
> docker build -t key-value-backend -f Dockerfile.dev . 

Run it:
> docker run -d --name backend --network key-value-net -p 3001:3001 key-value-backend

For hot reloading, install nodemon:
> npm i --save-exact nodemon@3.1.4

Then in `package.json` add the following (dev):
> "scripts": { \
> "start": "node src/server.js", \
> "dev": "nodemon src/server.js", \
> "test": "echo \"Error: no test specified\" && exit 1" \
> }