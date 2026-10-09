# Explain Velora in an interview

## Short pitch

“Velora is a hotel-booking microservice application that I use to demonstrate observability and DevSecOps. Four NestJS business services expose Node.js/process metrics and export OpenTelemetry traces through a collector to Jaeger. Prometheus evaluates availability, CPU, memory and event-loop alerts; Alertmanager delivers firing and resolved webhooks. A React dashboard uses a separate NestJS query API. I packaged the complete lab for Compose and Kubernetes, and added CI checks that verify telemetry and controlled service failure/recovery.”

Distinguish the original academic team application, your observability/DevSecOps contribution, and subsequent AI-assisted refinements. Show the code and successful receipts you understand.

## Likely questions

**Metrics versus traces?** Metrics summarize behavior over time. Traces connect individual operations across services. Logs record events. Prometheus handles metrics here; Jaeger handles traces. This project does not provision a centralized log backend.

**Why a collector?** Applications send one standard OTLP stream; the collector centralizes batching, memory protection and backend routing. It decouples instrumentation from the trace-storage backend. The collector does not create missing application spans.

**How do spans connect across services?** HTTP instrumentation extracts/injects trace context. A parent operation can contain outbound client and downstream server spans. Initialize instrumentation before HTTP/NestJS modules load, and use stable service names.

**What is ServiceDown actually measuring?** Prometheus cannot scrape `/metrics` successfully. This is a reachability/metrics endpoint signal, not proof that every business transaction works. Pending time reduces transient pages; group timing adds delivery delay.

**How did you validate notification delivery?** Stop/start a Compose service and scale a Kubernetes Deployment to zero/back to one. The test waits for an actual Alertmanager firing webhook and a resolved webhook, and saves receipts. Promtool unit tests separately check all rule thresholds.

**How do you interpret CPU and event-loop lag?** CPU counter rate is CPU seconds per wall-clock second, in cores; multiplying by 100 expresses a percentage of one core, possibly above 100. Event-loop lag uses prom-client's p99 metric in seconds, converted to milliseconds in the dashboard. RSS is bytes, converted to MiB.

**Why did you consolidate Compose?** Separate networks, host-local URLs and mismatched ports prevented reliable service/telemetry connectivity. One stack uses service DNS, a single browser reverse proxy and canonical monitoring files.

**What does the security pipeline block?** HIGH/CRITICAL production npm dependencies and fixable HIGH/CRITICAL application image vulnerabilities. It does not claim vulnerability-free software. Non-root application containers, read-only filesystems, capability removal and secret configuration reduce specific risks.

**How is Kubernetes different here?** Deployments reconcile replicas; Services provide stable DNS; probes control readiness/restarts; ConfigMaps/Secrets supply configuration; requests/limits express resource needs. The lab uses ephemeral storage and one replica, so it is not a production availability claim.

**What happens when monitoring fails?** Dashboard queries time out, and the UI shows an unavailable/stale warning rather than silently converting failure into healthy zero values. Trace export failure does not make the booking application depend synchronously on Jaeger.

**What would you improve next?** Reviewed database migrations, persistent volumes/trace storage, reservation authorization and concurrency guarantees, actual email delivery, TLS/ingress, telemetry sampling/redaction, and operational routing to a real on-call receiver. Prioritize these against a real deployment's needs.

## CV wording after a successful integration run

- Instrumented four NestJS business microservices with OpenTelemetry and Prometheus, routing traces through an OTel Collector to Jaeger and configuring availability, CPU, memory and event-loop alerts.
- Packaged a React monitoring dashboard and the platform for Docker Compose and Kubernetes; verified firing/resolved Alertmanager webhooks through controlled service-failure simulations.
- Implemented GitHub Actions checks for five backend services and the frontend, with runtime npm audits, Trivy image gates, monitoring-rule tests and automated deployment/telemetry verification.

Use only the tested portion if an integration job is still failing. Do not invent uptime, cost savings, traffic volumes or production resilience.
