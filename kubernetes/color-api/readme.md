Init the project (no need to repeat, if a package.json exists)
> npm init -y

Install dependencies (no need to repeat, if package.json has express)
> npm i --save-exact express@4.19.2

Test our docker file (we do not need to keep this container running)
> docker build -t color-api .

> docker run -p 3001:80 --name color-api color-api  

> curl http://localhost:3001

Now build the image and push it to dockerhub
> docker build -t <dockerhub-username>/color-api:1.0.0 . \
> docker images <dockerhub-username> \
> docker login \
> docker push <dockerhub-username>/color-api:1.0.0 \

Run it in Kubernetes
> kubectl run color-api --image=<dockerhub-username>/color-api:1.0.0 \

Verify
> kubectl logs color-api  \
```
> color-api@1.0.0 start
> node src/index.js

Example app listening on port 80!
```

Get the IP:
> kubectl describe pod color-api | grep IP:
```
IP:               10.244.0.6
```
Test it
> kubectl run -it alpine --image=alpine:3.20 sh \
> apk add curl \
> curl http://10.244.0.6
```
<h1 style="color:blue">Hello from Colors API!</h1>/ # 
```
Clean up
> kubectl delete pod --force=true alpine
> kubectl delete pod --force=true color-api