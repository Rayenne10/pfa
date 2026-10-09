# Velora backend

Five NestJS services live under `velora-platform/`. The four business services are auth, user, admin and customer; dashboard-service queries Prometheus for the React monitoring UI.

Use the root [README](../README.md) and `compose.yaml` for the complete lab. The former separate monitoring/Compose entry points were consolidated to eliminate network/port drift.
