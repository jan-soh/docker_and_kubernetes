### help
> docker --help

> docker run --help

### start containers

#### run
= create + start (the param «d» means «detached». The container stays running, if the shell is  closed.
> docker run -d nginx

will always create a new container!
only use «start» to just start an existing one, e.g. «docker start 66fc5f12csd»

passing the rm parameter will remove the container after it has been stopped
> docker run --rm -it 9f99fd21a151 sh

#### set a custom name for the container
> docker run -d --name web-server nginx

### parametrize containers:
here, we run a web-service and map the port it listens on:
host-port:container-port
> docker run -d -p 8080:80 --name web-server nginx

```
CONTAINER ID	IMAGE 	COMMAND	STATUS	PORTS	NAMES
66fcd5f45a3f	nginx	"/docker-entrypoint.…"	Up 2 minutes	0.0.0.0:8080->80/tcp, [::]:8080→80/tcp	web-server
```
It is also possible to set environment variables with the -e parameter
> docker run -e PORT=3003 -e APP_NAME="another awesome express app" -d -p 3003:3003 --name express-3003 express

Or via environment file
> docker run -d -p 3003:3003 --name express-3003 --env-file .env express

### stop images
> docker stop 3434adfg

name also works
> docker stop web-server

#### kill 
stops the container immediately (not nice in production → data loss for instance)
> docker kill 3434adfg

### images

get an image from docker hub (DL to local cache)
> docker pull ubuntu

#### show all images
> docker images

#### remove image
> docker image rm 787aafadfa

> docker rmi 787aafadfa

#### tag images
(user name is only required if you want to push the image)
> docker tag simple_hello_world:latest jansoh/simple_hello_world:0.0.1

images can also be pushed, but a login is needed then
> docker login

> docker push jansoh/simple_hello_world:0.0.1

the image will be pushed to our private repo

### containers 
show all running containers
> docker ps

show all containers (even those not running)
> docker ps -a

> docker ps -a | grep web_server

> docker ps –filter name=web_server

show only IDs
> docker ps -q
```
6asdff45a3f
6ergff45a3f
sdaf5f45a3f
```

### chain commands
> docker stop $(docker ps -q)

### logs

to inspect the logs run
> docker logs web_server

follow the logs (keeps the output alive)
> docker logs -f web_server

### exec
get an interactive shell within the container (or how to execute commands in the container)
> docker exec -it web_server sh

> docker exec -it web_server /bin/bash

### build 
build a docker file («Dockerfile») e.g.

```
Dockerfile
FROM ubuntu:latest
CMD [«echo», «Hello from my first Docker image!»]
```

> docker build .

this will just create the image

> docker images

```<none>	<none>	c67345345df	1 minutes ago	101MB```

this image can then be run
> docker run c67345345df

#### tags

you can add a tag to the image (otherwise it will be named «<none>:<none>»)
in this case the version is omitted resulting in the tag "web_server:latest"
> docker build -t web_server .
 
this also specifies the version

> docker build -t web_server:0.0.1 .

you can also set aliases for tags
> docker tag web_server:0.0.1 web_server:latest

### History (and image layers)
this will display all commands executed when building the image line by line, where every line is any image by itself
> docker history web_server

```
IMAGE          CREATED        CREATED BY                                      SIZE      COMMENT
7f2e2b22ecc1   17 hours ago   CMD ["node" "index.js"]                         0B        buildkit.dockerfile.v0
<missing>      17 hours ago   EXPOSE [3001/tcp]                               0B        buildkit.dockerfile.v0
<missing>      17 hours ago   COPY src/index.js index.js # buildkit           12.3kB    buildkit.dockerfile.v0
```
if the image ID is <missing>, it means that the image is not tagged and usually be removed after the build completed.

### custom dockerfile
just provide the "f" parameter followed by the path to the dockerfile
> docker build -t cmd-example -f Dockerfile.cmd .

### cmd and entrypoint

we can override the cmd in the Dockerfile.cmd by passing a command to the docker run command.
> docker run --rm cmd-example echo "hello from terminal"

... which can be anything
> docker run --rm cmd-example sh -c "apk add curl && curl https://www.google.com"

that does not count for entrypoints. in this case the provided commands will be appended to the entrypoint.
> docker run --rm entrypoint-example echo "hello from the terminal"

`hello from ERNTRYPOINT in Dockerfile.entrypoint hello from the terminal`

... but even this can be done
> docker run --rm --entrypoint "echo" entrypoint-example "hello from the terminal"