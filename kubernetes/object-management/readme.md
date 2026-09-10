Running a pod configuration file:
> kubectl create -f nginx-pod.yaml \
> kubectl create -f nginx-svc.yaml \

Delete everything
> kubectl delete -f nginx-pod.yaml \
> kubectl delete -f nginx-svc.yaml \

Turning imperative commands into a configuration file (this is not being executed)
> kubectl run color-api --image=jansohnema/color-api:1.0.0 --dry-run=client -o yaml