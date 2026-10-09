"""Local demo receiver: keeps the last 100 Alertmanager webhook deliveries in RAM."""
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from collections import deque
from threading import Lock

EVENTS = deque(maxlen=100)
LOCK = Lock()

class Handler(BaseHTTPRequestHandler):
    def respond(self, code, body):
        payload = json.dumps(body).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if self.path == '/healthz':
            return self.respond(200, {'status': 'ok'})
        if self.path == '/events':
            with LOCK:
                events = list(EVENTS)
            return self.respond(200, events)
        self.respond(404, {})

    def do_POST(self):
        if self.path != '/alerts':
            return self.respond(404, {})
        size = int(self.headers.get('Content-Length', '0'))
        if not 0 < size <= 1048576:
            return self.respond(413, {})
        try:
            event = json.loads(self.rfile.read(size))
            if not isinstance(event, dict) or not isinstance(event.get('alerts'), list):
                raise ValueError('Invalid webhook')
        except (ValueError, UnicodeError):
            return self.respond(400, {})
        with LOCK:
            EVENTS.append(event)
        self.respond(200, {'received': True})

if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', 9095), Handler).serve_forever()
