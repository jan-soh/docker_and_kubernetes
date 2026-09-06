> npx create-react-app --template typescript containerize-react-app

> cd containerize-react-app

> npm start

npm start just executes the "start" script defined in package.json which is in fact this line
"start": "react-scripts start"
Looking at the dependencies in package.json, there is a dependency on react-scripts
Those scripts can then be found in the node_modules/react-scripts/scripts folder

To create the production build, simply run
> npm run build

We use this command in our Dockerfile.dev
Build it with:
> docker build -t react-app:dev -f Dockerfile.dev .

Lets run it:
> docker run --rm -d -p 3002:3000 react-app:dev

Let's add a volume to use hot reloading (-v [local-dir]:[container-dir])
> docker run --rm -d -p 3002:3000 -v ./public:/app/public -v ./src:/app/src react-app:dev

# Using named volumes
> docker volume create website-data
> docker run --rm -d -p 3002:80 --name website-main -v website-data:/usr/share/nginx/html nginx:1.27.0

To show all volumes:
> docker volume ls

Show details of a volume:
> docker volume inspect website-data

Remove the volume:
> docker volume rm website-data

Remove all unused volumes:
> docker volume rm $(docker volume ls -qf dangling=true)

or simply:
> docker volume prune