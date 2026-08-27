### help
> docker --help

> docker run --help

### start containers

#### run
= create + start (the param «d» means «detached». The container stays running, if the shell is  closed.
> docker run -d nginx

will always create a new container!
only use «start» to just start an existing one, e.g. «docker start 66fc5f12csd»

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

you can add a tag to the image (otherwise it will be named «<none>:<none>»)
in this case the version is omitted resulting in the tag "web_server:latest"
> docker build -t web_server .
 
this also specifies the version

> docker build -t web_server:0.0.1 .

this will just create the image

> docker images

```<none>	<none>	c67345345df	1 minutes ago	101MB```

this image can then be run
> docker run c67345345df


