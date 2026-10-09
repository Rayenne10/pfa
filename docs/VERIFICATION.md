# Verification evidence and limits

## Verified run — 9 October 2026

[Successful full CI run](https://github.com/Rayenne10/pfa/actions/runs/37922764806) verified commit `fad2491fea0d5f05dd19a503af897aa328f1ca98`.

[Download the verification artifact](https://github.com/Rayenne10/pfa/actions/runs/37922764806/artifacts/11612424800): `velora-verification-37922764806`. Retain your downloaded copy; GitHub artifact retention is finite.

| Executed check | Result |
| --- | --- |
| Five NestJS builds/tests and compiled runtime module loads | Passed |
| React production build | Passed |
| Six runtime npm audit gates | Passed |
| Six Trivy application image gates | Passed; zero fixable HIGH/CRITICAL findings in these reports |
| Prometheus config, four alert-condition tests and healthy baseline | Passed |
| Alertmanager config and Kubernetes generation drift | Passed |
| Compose HTTP, registration/login, four scrape targets and four traced services | Passed |
| Auth-to-user spans sharing a trace ID | Passed in Compose and Kubernetes |
| Firing/resolved ServiceDown webhooks | Passed in Compose and Kubernetes |
| Dashboard desktop/mobile rendering and failed-fetch warning | Passed; screenshots retained in artifact |
| All 12 Kubernetes Deployments available, live HTTP and telemetry | Passed |
| Disposable kind cluster removal | Passed |

The documentation-only evidence update following that tested commit does not change the runtime or workflow.

## Repeatable checks and limits

The refinement is checked by the **Velora DevSecOps** GitHub Actions workflow. Use the latest completed run on main; an uncompleted or failed run is not evidence of success.

The integration artifact `velora-verification-RUN_ID` contains:

- Compose and Kubernetes receipts for HTTP health, four healthy scrape targets, traces from four services, dashboard data and registration/login.
- Firing and resolved `ServiceDown` webhook receipts from controlled stop/start and scale-to-zero/recovery experiments.
- Desktop/mobile React screenshots and test logs.
- Application image Trivy reports and Kubernetes/Compose diagnostics.

Promtool separately checks all four alert conditions and a healthy baseline. CPU, memory and event-loop rules are not claimed as live overload experiments. The local receiver proves webhook delivery; no email/SMS integration is claimed.

CI runtime audits block HIGH/CRITICAL findings. Trivy blocks HIGH/CRITICAL image findings with available fixes. Development-only dependency findings and unfixed image findings are outside those gates; review their reports rather than claiming zero vulnerabilities.

No production/cloud cluster deployment, high availability, autoscaling, load benchmark, persistent Kubernetes database, HTTPS or public hosted endpoint is claimed. Jaeger and webhook history are in memory. Kubernetes lab data is disposable. Review [SECURITY.md](../SECURITY.md) before changing the exposure model.

The original CV described Kubernetes deployment/failure validation before manifests and repeatable evidence were present in this repository. The refinement adds those implementations and automated experiments; substantiate the final wording with a successful run and explain your personal contribution.
