> docker build -t cmd-example -f Dockerfile.cmd .

we can override the cmd in the Dockerfile.cmd by passing a command to the docker run command.
> docker run --rm cmd-example echo "hello from terminal"

... which can be anything
> docker run --rm cmd-example sh -c "apk add curl && curl https://www.google.com" 

that does not count for entrypoints. in this case the provided commands will be appended to the entrypoint.
> docker run --rm entrypoint-example echo "hello from the terminal"

`hello from ERNTRYPOINT in Dockerfile.entrypoint hello from the terminal`

... but even this can be done
> docker run --rm --entrypoint "echo" entrypoint-example "hello from the terminal"