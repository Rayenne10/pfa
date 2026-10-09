# Local setup

Clone this repository, open Git Bash in its root, and run:

```sh
python scripts/setup_env.py
docker compose up --build -d --wait --wait-timeout 240
docker compose ps
python scripts/smoke.py
```

The generated `.env` contains local-only secrets. Do not regenerate it against an existing PostgreSQL volume without accounting for the original database password. Never paste it into a public issue or commit it.

If using `.env.example` instead, replace all credential placeholders with separate random values; JWT and internal API values must be at least 32 characters. Service startup fails closed if required credentials are missing.

## Optional booking admin

Set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env`, then recreate the user service:

```sh
docker compose up -d --force-recreate user-service
```

The seed runs only with an explicitly configured password and does not replace an existing user's password. Log in through the booking UI. Registration creates demo users without claiming verified email ownership. Password reset/verification endpoints return 503 until a proper email delivery flow is implemented.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Port already allocated | Change `FRONTEND_PORT`; stop the service using 9090/9093/9095/16686 before starting the lab |
| Database authentication failure | Existing volume retains its original credentials; preserve data or deliberately reset it with `docker compose down -v` |
| Backend not healthy | `docker compose logs user-service admin-service customer-service auth-service`; check database initialization |
| Empty trace search | Generate requests, wait several seconds, then select a service in Jaeger; inspect collector and application logs |
| Dashboard unavailable | Check Prometheus targets, dashboard-service logs and frontend proxy logs |
| No notification | Wait for pending/grouping delays; inspect Prometheus alerts, Alertmanager and `/events` |
| Missing metric at startup | CPU needs multiple samples; dashboard shows missing data separately from healthy service status |

TypeORM schema synchronization is enabled only by the lab configuration (`DB_SYNCHRONIZE=true`). Replace this with reviewed migrations for real persistent deployments.

## Application development

Use Node.js 24. In a service directory, run `npm ci`, `npm run build`, and `npm test -- --runInBand`. Each service reads database/network/OTLP configuration from environment variables. The Docker stack is the simplest complete runtime.

For frontend development, keep the stack on port 8080 and run `npm ci && npm run dev` in `frontend/`; Vite proxies `/api` to that local frontend gateway.
