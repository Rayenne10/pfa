# Five-minute demonstration

1. Open `/observability`; explain the four service cards, CPU cores, RSS and p99 event-loop lag. Show the dashboard's explicit error state when monitoring is unavailable.
2. Open Prometheus `/targets`; show four healthy business-service scrape targets. Query `up`, `rate(process_cpu_seconds_total[1m])` and `nodejs_eventloop_lag_p99_seconds`.
3. Register a local test user or browse the hotel UI. In Jaeger select `auth-service` and inspect request/client/server spans. Explain context propagation between services, collector batching and the in-memory trace storage limit.
4. Stop `auth-service` with Compose, or scale its Kubernetes Deployment to zero. Wait for `ServiceDown`, then show Alertmanager and the receiver's `/events` record. Restart it and show the resolved notification.
5. Open the successful Actions run and its verification artifact. Explain which tests run against actual containers and which are rule/configuration tests. End with cleanup and the limits of this local lab.

Only run failure simulations in this disposable environment. CPU/memory/lag thresholds are tested with promtool series; the automated runtime experiment deliberately exercises service availability, not an uncontrolled resource-exhaustion test.
