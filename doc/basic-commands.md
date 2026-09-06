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
7f2e2b22ecc1   17 hours ago   CMD ["node" "index.ts"]                         0B        buildkit.dockerfile.v0
<missing>      17 hours ago   EXPOSE [3001/tcp]                               0B        buildkit.dockerfile.v0
<missing>      17 hours ago   COPY src/index.ts index.ts # buildkit           12.3kB    buildkit.dockerfile.v0
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

### Mounts and volumes
Add a volume (for instance, to use hot reloading) (-v [local-dir]:[container-dir])
> docker run --rm -d -p 3002:3000 -v ./public:/app/public -v ./src:/app/src react-app:dev

This will /app/public and /app/src in the container point to the local directories of the host.

#### Using named volumes
Volumes work similarly to bind mounts, but they are managed by Docker.
Instead of remembering the exact path to the host directory, you can use a volume name.
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

### Managing CPU resources
> docker run -d --name cpu_decimals --cpus=0.5 busybox sh -c "while true do:; done"

This allows the container to use up to 50% of a single core of the CPU.

> docker run -d --name cpu_share_low --cpu-shares=1 --cpuset-cpus=0 busybox sh -c "while true do:; done"

`--cpu-shares=1` means that the container will use one share of the CPU – which is yet 100% because there is no other container using the CPU yet.

`--cpuset-cpus=0` means that the container will only use the CPU with the ID 0.

Now let’s consider running another container with shares:
> docker run -d --name cpu_share_high --cpu-shares=3 --cpuset-cpus=0 busybox sh -c "while true do:; done"

This container will use 3 of 4 shares of the CPU, resulting in 75% of the CPU, while the container with shares 1 (0cpu_share_low) will use 25% of the CPU.
This is not a hard limit. If available, cpu_share_low container may use 100% of the CPU, if no other container is using it.

> docker run -d --name cpu_quota --cpu-period=100000 --cpu-quota=25000 busybox sh -c "while true do:; done"

This says that the container will use 25% of the CPU (one could also say --cpu-period=100 --cpu-quota=25).
This is the same as saying:
> docker run -d --name cpu_quota --cpus=0.25 busybox sh -c "while true do:; done"

show stats (like CPU usage)
> docker stats

### Managing memory resources
> docker run -d --name mongodb --memory="20m" mongodb/mongodb-community-server:7.0-ubuntu2204

This might disallow the container to start, as the container requires more memory than the specified limit.
See state ("OOMKilled" -> out of memory killer):
> docker inspect mongodb

> docker run -d --name mongodb --memory-reservation="80m" --memory="100m" mongodb/mongodb-community-server:7.0-ubuntu2204

Limit the memory usage of the container to 100MiB, but reserve at least 80MiB.
If the container tries to use more than 100MB, it will be killed.

> docker run -d --name mongodb --memory="100m" --memory-swap="1g" mongodb/mongodb-community-server:7.0-ubuntu2204

This will limit the memory usage of the container to 100MiB, but allow it to use up to 900GiB of swap (disk) space.
Exceeding the memory limit of 100MiB will allow the container to continue running (and use swap memory if necessary).
Exceeding the swap limit will cause the container to be killed.

### Restarting policies
The following will restart the container if it exits with a non-zero exit code.
> docker run -d --name restart_fail --restart on-failure busybox sh -c "sleep 3; exit 1"

We can also specify the number of restarts before the container is considered unhealthy.
> docker run -d --name restart_fail --restart on-failure:3 busybox sh -c "sleep 3; exit 1"

Validate that by inspecting the container:
> docker inspect restart_fail | grep restart

And we can also specify a restart always policy:
> docker run -d --name restart_always --restart always busybox sh -c "sleep 3; exit 0"

Stopping the container manually will not restart it:
> docker stop restart_always

The difference between restart always and restart unless-stopped is that once we stopped this container, it will not restart automatically if the docker deamon is restarted.
> docker run -d --name restart_always --restart unless-stopped busybox sh -c "sleep 3; exit 0"

### Networking

Inspect networks:
> docker network ls
> docker network inspect bridge

```
NETWORK ID     NAME                 DRIVER    SCOPE
5d2c14aab65d   bridge               bridge    local
1313cbd0cfed   host                 host      local
5b646cc9dc94   none                 null      local
```
`bridge` is the default and a private network and it is isolated from the host. Here we cannot connect to other containers using their name.
`host` This network removes isolation from the host and allows containers to communicate with each other directly.
`none` This network prevents a container from connecting to any other networks.

Create a network:
> docker network create app-net

> docker network inspect app-net

Create a container and connect it to the network:
> docker run -d --name web-server nginx:1.27.0

> docker network connect app-net web-server

> docker inspect web-server

Because we did not initially connect the container to the app-net network, when we inspect the container, we will see that it is also connected to the bridge network.
```
"NetworkSettings": {
    "SandboxID": "8e429ac480f9f28bd83e71940da2242ace908e661f278f51a65ce3437c7d1579",
    "SandboxKey": "/var/run/docker/netns/8e429ac480f9",
    "Ports": {
        "80/tcp": null
    },
    "Networks": {
        "app-net": {
            "IPAddress": "172.20.0.2",
            "DNSNames": [
                "web-server",
                "ab0bcc2611a9"
            ]
            ...
        },
        "bridge": {
            "IPAddress": "172.17.0.2",
            "DNSNames": null
            ...
        }
    }
}   
```
As we can see, the container has a different IP address in each network and no DNS name in the bridge network.
Lets try to connect to the web-server container by starting a new shell in a container:
> docker run -it --network app-net alpine:3.20 sh

> apk add curl

> curl web-server

Great:
```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

We can also expose port 80 of the container to the host:
> docker run -d --name web-server --network app-net -p 80:80 nginx:1.27.0
> curl http://localhost
Great:
```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

Remove network:
> docker network rm app-net


### Host networking
> docker run -d --net=host nginx:1.27.0
> docker inspect cd65285914b2
 
Interestingly, the IP address is empty, but this is because there is no isolation between the host and the container.
```
NetworkSettings": {
    ...
    "Networks": {
        "host": {
            ...
            "IPAddress": "",
...
```
Executing curl on the the host machine would work:
> curl http://localhost 

(On Mac it doens't work because the docker daemon is running in a VM)

### Compose

> docker compose --help

Running docker files
> docker compose up --help \
> docker compose up

This creates and starts all containers defined in the docker compose file.
To only start containers:
> docker compose start

When starting single services, you can also use the service name:
> docker compose start backend

This will also start all services that "backend" depends on.

This will stop and remove all containers, and networks (but not the images and volumes)
> docker compose down

To remove all volumes as well:
> docker compose down --volumes
 
Only stop (not remove) containers
> docker compose stop

If those are not working, it might be that no standalone docker compose was installed.
Then "docker-compose" will do it – which is shipped with docker.

Run docker file forcing it to build the images as well
> docker compose up --build

Enable watches (e.g., for hot reloading):
> docker compose up --watch

Only list the containers of a docker compose file
> docker compose ps

Print the logs of a service (use the service name given in the docker compose file)
> docker compose logs backend