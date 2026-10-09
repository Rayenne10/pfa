# Security scope

Velora is a localhost-bound academic demonstration. Do not expose this stack directly to the internet or load it with real personal/customer data.

## Improvements in this refinement

- JWT/internal API credentials come from local configuration; seed-admin creation requires an explicit password.
- Internal user creation/email lookup is token-protected; the browser proxy removes user-supplied internal credential headers. User profile updates require an authenticated owner/admin or trusted internal request. Password hashes are omitted from public user responses.
- Registration hashes passwords once in the user service. Request payloads/passwords are not printed by the seed/create flow.
- Password reset and email verification are disabled until a real secure delivery flow exists; no recovery token is returned to an arbitrary caller.
- Application containers run without root/capabilities and use read-only root filesystems. CI performs blocking runtime/image vulnerability checks with their documented scope.

## Remaining boundaries

This is not a completed security review of the inherited booking application. Reservation ownership checks, transaction/overbooking protection, rate limiting, token revocation, restrictive network policy, HTTPS, dependency lifecycle and persistent data/migration practices need further design before real use. Local monitoring interfaces and the webhook receiver have no user authentication and are reachable only through localhost-published ports or deliberate cluster port forwarding.

TypeORM synchronization is explicitly enabled for the disposable lab; it is unsuitable as a migration strategy for a real persistent deployment. Auto-instrumentation can capture request URLs and database operations; do not put secrets in URLs or use sensitive datasets without evaluating telemetry redaction and sampling.

The Trivy gate ignores findings without available fixes; the npm gate focuses on runtime dependencies. These are specific acceptance rules, not a claim that all dependencies or images have zero vulnerabilities. Private `.env` values and Kubernetes Secrets must not be committed.
