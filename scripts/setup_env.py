"""Create fresh local lab credentials without printing or overwriting them."""
import secrets
from pathlib import Path

path = Path(__file__).resolve().parents[1] / '.env'
if path.exists():
    raise SystemExit('.env already exists; preserve it or remove it explicitly before generating new credentials')
path.write_text('POSTGRES_USER=velora\n' + ''.join(f'{key}={secrets.token_hex(32)}\n' for key in ['POSTGRES_PASSWORD', 'JWT_SECRET', 'INTERNAL_API_TOKEN']) + 'FRONTEND_PORT=8080\n')
path.chmod(0o600)
print('Created .env with fresh local credentials. Do not commit this file.')
