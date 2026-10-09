#!/usr/bin/env bash
set -euo pipefail
mkdir -p verification
kind create cluster --name velora --wait 120s
cleanup() {
  kubectl -n velora scale deployment/auth-service --replicas=1 >/dev/null 2>&1 || true
  kubectl -n velora get pods -o wide > verification/kubernetes-pods.txt 2>&1 || true
  kubectl -n velora get events --sort-by=.lastTimestamp > verification/kubernetes-events.txt 2>&1 || true
  for name in auth-service user-service admin-service customer-service dashboard-service frontend postgres jaeger otel-collector prometheus alertmanager alert-sink; do
    kubectl -n velora logs deployment/"$name" --all-containers > "verification/kubernetes-$name.log" 2>&1 || true
  done
  jobs -p | xargs -r kill || true
  kind delete cluster --name velora
}
trap cleanup EXIT
for name in auth-service user-service admin-service customer-service dashboard-service frontend; do kind load docker-image "velora/$name:local" --name velora; done
kubectl create namespace velora
kubectl -n velora create secret generic velora-secrets --from-literal=POSTGRES_PASSWORD="$POSTGRES_PASSWORD" --from-literal=JWT_SECRET="$JWT_SECRET" --from-literal=INTERNAL_API_TOKEN="$INTERNAL_API_TOKEN"
kubectl apply -f k8s/lab.yaml
kubectl -n velora wait --for=condition=Available deployment --all --timeout=300s
kubectl -n velora port-forward service/frontend 8080:8080 > verification/forward-frontend.log 2>&1 &
kubectl -n velora port-forward service/prometheus 9090:9090 > verification/forward-prometheus.log 2>&1 &
kubectl -n velora port-forward service/jaeger 16686:16686 > verification/forward-jaeger.log 2>&1 &
kubectl -n velora port-forward service/alert-sink 9095:9095 > verification/forward-sink.log 2>&1 &
python scripts/smoke.py --output verification/kubernetes-receipt.json
kubectl -n velora scale deployment/auth-service --replicas=0
python scripts/smoke.py --alert firing --output verification/kubernetes-firing.json
kubectl -n velora scale deployment/auth-service --replicas=1
kubectl -n velora rollout status deployment/auth-service --timeout=120s
python scripts/smoke.py --alert resolved --output verification/kubernetes-resolved.json
