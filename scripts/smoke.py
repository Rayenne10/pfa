"""Verify live HTTP, scraped metrics, exported traces and webhook delivery."""
import argparse
import json
import time
import urllib.request
import urllib.error
from pathlib import Path

APPS = ['auth-service', 'user-service', 'admin-service', 'customer-service']

def get(url):
    with urllib.request.urlopen(url, timeout=10) as response:
        return json.load(response)

def wait(label, check, timeout=180):
    end = time.monotonic() + timeout
    last = None
    while time.monotonic() < end:
        try:
            value = check()
            if value: return value
        except (OSError, ValueError, KeyError) as exc:
            last = exc
        time.sleep(2)
    raise RuntimeError(f'{label} timed out; last error: {last}')

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--frontend', default='http://127.0.0.1:8080')
    p.add_argument('--prometheus', default='http://127.0.0.1:9090')
    p.add_argument('--jaeger', default='http://127.0.0.1:16686')
    p.add_argument('--sink', default='http://127.0.0.1:9095')
    p.add_argument('--alert', choices=['firing', 'resolved'])
    p.add_argument('--output', default='verification/receipt.json')
    a = p.parse_args()
    if a.alert:
        def delivered():
            return [alert for event in get(a.sink+'/events') for alert in event['alerts']
                    if alert['labels'].get('alertname') == 'ServiceDown' and alert['labels'].get('job') == 'auth-service' and alert['status'] == a.alert]
        found = wait('ServiceDown '+a.alert+' webhook', delivered)
        result = {'alert': 'ServiceDown', 'service': 'auth-service', 'webhook_status': a.alert, 'deliveries': len(found)}
    else:
        for route in ['auth', 'users', 'admin', 'customer', 'dashboard']:
            wait(route+' health', lambda route=route: get(a.frontend+'/api/'+route+'/healthz'))
        def scraped():
            targets = get(a.prometheus+'/api/v1/targets')['data']['activeTargets']
            return len(targets) == 4 and all(t['health'] == 'up' for t in targets)
        wait('four healthy scrape targets', scraped)
        for app in APPS:
            wait(app+' traces in Jaeger', lambda app=app: get(a.jaeger+'/api/traces?service='+app)['data'])
        metrics = get(a.frontend+'/api/dashboard/dashboard/metrics')
        if len(metrics['status']) != 4: raise RuntimeError('Dashboard did not return all four service statuses')
        # Regression: caller cannot request account recovery tokens or read password hashes.
        try:
            get(a.frontend+'/api/users/users/email/admin@example.test')
            raise RuntimeError('Internal credential endpoint was publicly accessible')
        except urllib.error.HTTPError as exc:
            if exc.code != 401: raise
        email = 'smoke-'+str(time.time_ns())+'@example.test'
        def post(path, body):
            req = urllib.request.Request(a.frontend+path, data=json.dumps(body).encode(), headers={'Content-Type':'application/json'}, method='POST')
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.load(response)
                return data.get('data', data)
        created = post('/api/auth/auth/register', {'email': email, 'password': 'smoke-password-123', 'firstName':'Smoke', 'lastName':'Test'})
        if 'password' in created.get('user', {}): raise RuntimeError('Registration leaked a password hash')
        token = post('/api/auth/auth/login', {'email':email, 'password':'smoke-password-123'})['access_token']
        if not token: raise RuntimeError('Login failed')
        def correlated():
            traces = get(a.jaeger+'/api/traces?service=auth-service')['data']
            return any({'auth-service', 'user-service'}.issubset({proc['serviceName'] for proc in trace['processes'].values()}) for trace in traces)
        wait('propagated auth-to-user trace', correlated)
        result = {'http': True, 'four_prometheus_targets': True, 'four_jaeger_services': True, 'dashboard': True, 'correlated_auth_user_trace': True, 'registration_login': True, 'internal_user_api_protected': True}
    target = Path(a.output); target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps(result, indent=2))

if __name__ == '__main__': main()
