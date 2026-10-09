# Verification evidence and limits

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
