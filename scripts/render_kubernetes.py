"""Generate the disposable Kubernetes lab from the canonical Compose/config files."""
from pathlib import Path
import argparse
import yaml

ROOT = Path(__file__).resolve().parents[1]
APPS = ['auth-service', 'user-service', 'admin-service', 'customer-service', 'dashboard-service']

def render():
    compose = yaml.safe_load((ROOT / 'compose.yaml').read_text())
    docs = [{'apiVersion': 'v1', 'kind': 'Namespace', 'metadata': {'name': 'velora'}}]
    def add(kind, name, **fields):
        docs.append({'apiVersion': 'apps/v1' if kind == 'Deployment' else 'v1', 'kind': kind,
                     'metadata': {'name': name, 'namespace': 'velora'}, **fields})
    add('ConfigMap', 'monitoring-config', data={p.name: p.read_text() for p in (ROOT / 'monitoring').glob('*.yml') if p.name != 'rule-tests.yml'})
    add('ConfigMap', 'postgres-init', data={'init.sql': (ROOT / 'backend/init-db/init.sql').read_text()})
    add('ConfigMap', 'alert-sink-script', data={'alert_sink.py': (ROOT / 'scripts/alert_sink.py').read_text()})
    for name, spec in compose['services'].items():
        ports = {'frontend': [8080], 'postgres': [5432], 'jaeger': [16686, 4317], 'otel-collector': [4318, 13133], 'prometheus': [9090], 'alertmanager': [9093], 'alert-sink': [9095]}.get(name, [3000])
        c = {'name': name, 'image': spec['image'], 'imagePullPolicy': 'IfNotPresent', 'ports': [{'containerPort': p} for p in ports],
             'resources': {'requests': {'cpu': '50m', 'memory': '64Mi'}, 'limits': {'cpu': '1000m', 'memory': '512Mi'}}}
        vols = []
        def volume(n, source, mount, **extra):
            vols.append({'name': n, **source})
            c.setdefault('volumeMounts', []).append({'name': n, 'mountPath': mount, **extra})
        if name in APPS:
            env = {k: v for k, v in spec['environment'].items() if not str(v).startswith('${')}
            env.update({'DB_USER': 'velora', 'CORS_ORIGIN': 'http://localhost:8080'})
            env.pop('SEED_ADMIN_PASSWORD', None); env.pop('SEED_ADMIN_EMAIL', None)
            c['env'] = [{'name': k, 'value': str(v)} for k, v in env.items()]
            for key in ['JWT_SECRET', 'INTERNAL_API_TOKEN', 'DB_PASS']:
                c['env'].append({'name': key, 'valueFrom': {'secretKeyRef': {'name': 'velora-secrets', 'key': 'POSTGRES_PASSWORD' if key == 'DB_PASS' else key}}})
            c['startupProbe'] = {'httpGet': {'path': '/healthz', 'port': 3000}, 'failureThreshold': 60, 'periodSeconds': 5}
            c['readinessProbe'] = {'httpGet': {'path': '/readyz', 'port': 3000}, 'periodSeconds': 5}
            c['livenessProbe'] = {'httpGet': {'path': '/healthz', 'port': 3000}, 'periodSeconds': 10}
        elif name == 'postgres':
            c['env'] = [{'name': 'POSTGRES_USER', 'value': 'velora'}, {'name': 'POSTGRES_DB', 'value': 'velora'}, {'name': 'POSTGRES_PASSWORD', 'valueFrom': {'secretKeyRef': {'name': 'velora-secrets', 'key': 'POSTGRES_PASSWORD'}}}]
            volume('data', {'emptyDir': {}}, '/var/lib/postgresql/data')
            volume('init', {'configMap': {'name': 'postgres-init'}}, '/docker-entrypoint-initdb.d')
            c['readinessProbe'] = {'exec': {'command': ['pg_isready', '-U', 'velora', '-d', 'velora']}, 'periodSeconds': 5}
        else:
            if name in ['prometheus', 'alertmanager', 'otel-collector']:
                c['args'] = spec['command']
                files = {'prometheus': ['prometheus.yml', 'alerts.yml'], 'alertmanager': ['alertmanager.yml'], 'otel-collector': ['otel-collector.yml']}[name]
                mount = {'prometheus': '/etc/prometheus', 'alertmanager': '/etc/alertmanager', 'otel-collector': '/etc/otelcol'}[name]
                volume('config', {'configMap': {'name': 'monitoring-config', 'items': [{'key': f, 'path': 'config.yaml' if name == 'otel-collector' else f} for f in files]}}, mount)
                if name in ['prometheus', 'alertmanager']: volume('data', {'emptyDir': {}}, '/'+name)
            if name == 'alert-sink':
                c['command'] = spec['command']
                volume('script', {'configMap': {'name': 'alert-sink-script'}}, '/app')
            probe = {'frontend': (8080, '/healthz'), 'prometheus': (9090, '/-/ready'), 'alertmanager': (9093, '/-/ready'), 'alert-sink': (9095, '/healthz'), 'otel-collector': (13133, '/')}.get(name)
            if probe: c['readinessProbe'] = {'httpGet': {'port': probe[0], 'path': probe[1]}, 'periodSeconds': 5}
        pod = {'containers': [c], 'automountServiceAccountToken': False}
        if name != 'postgres':
            uid = 1000 if name in APPS else {'frontend': 101, 'prometheus': 65534, 'alertmanager': 65534}.get(name, 10001)
            pod['securityContext'] = {'runAsNonRoot': True, 'runAsUser': uid, 'runAsGroup': uid, 'fsGroup': uid, 'seccompProfile': {'type': 'RuntimeDefault'}}
            c['securityContext'] = {'allowPrivilegeEscalation': False, 'readOnlyRootFilesystem': True, 'capabilities': {'drop': ['ALL']}}
            volume('tmp', {'emptyDir': {}}, '/tmp')
        if vols: pod['volumes'] = vols
        add('Deployment', name, spec={'replicas': 1, 'selector': {'matchLabels': {'app': name}}, 'template': {'metadata': {'labels': {'app': name}}, 'spec': pod}})
        add('Service', name, spec={'selector': {'app': name}, 'ports': [{'name': 'p'+str(p), 'port': p, 'targetPort': p} for p in ports]})
    return yaml.safe_dump_all(docs, sort_keys=False)

if __name__ == '__main__':
    p = argparse.ArgumentParser(); p.add_argument('--check', action='store_true'); args = p.parse_args()
    target = ROOT / 'k8s/lab.yaml'; output = render()
    if args.check:
        if not target.exists() or target.read_text() != output: raise SystemExit('Run python scripts/render_kubernetes.py and commit k8s/lab.yaml')
        print('Kubernetes manifests match canonical configuration')
    else:
        target.parent.mkdir(exist_ok=True); target.write_text(output)
