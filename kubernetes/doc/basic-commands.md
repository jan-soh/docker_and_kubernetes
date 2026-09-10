First follow the steps in ../install-minikube

Start the cluster:
> minikube start

Test it:
> kubectl config current-context

Stop the cluster:
> minikube stop

Helpful debugging commands
> kubectl describe pod <pod-name>

> kubectl logs <pod-name>

> kubectl events pod <pod-name>

Setting the context (the cluster you want to use)
> kubectl config set-context minikube

Starting a pod
> kubectl run --help

Start an nginx pod using a certain image
> kubectl run nginx --image=nginx:1.27.0

> kubectl run -it alpine --image=alpine:3.20 sh \
> apk --update add curl \
> curl 10.244.0.3

See if this pod is running
> kubectl get pods

Get more information about a ressource:
kubectl describe <ressource> <name>
> kubectl describe pod nginx

Logs
> kubectl logs nginx

Get logs of all previous instances
> kubectl logs nginx --previous

Only print logs of a certain container
> kubectl logs nginx --container=nginx

Deleting a pod
kubectl delete <ressource> <name>
> kubectl delete pod alpine 
> kubectl delete --help

Exposing a pod as a service
> kubectl expose pod nginx --type=NodePort --port=80
> kubectl get service
```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP        105m
nginx        NodePort    10.97.248.17   <none>        80:31136/TCP   2m52s
```
To communicate with the pod, we can either use the pods IP or the ClusterIP.
> curl 10.244.0.3 \
> curl 10.97.248.17

The cluster IP is more stable.
Also we could use the service name to access the service.
> curl nginx

Delete the service
> kubectl delete service nginx

Files:
Running a pod configuration file:
> kubectl create -f nginx-svc.yaml \

Passing multiple files is possible:
> kubectl create -f nginx-pod.yaml -f nginx-svc.yaml

Or even a whole directory:
> kubectl create -f .

Delete everything from a file:
> kubectl delete -f nginx-pod.yaml \

Only apply the changes:
> kubectl apply -f nginx-pod.yaml

Show the differences that would be applied:
> kubectl diff -f nginx-pod.yaml

