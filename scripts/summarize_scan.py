"""Print actionable image findings while retaining the full JSON artifact."""
import json
import sys
from pathlib import Path

report = Path(sys.argv[1])
if not report.exists():
    raise SystemExit('Scanner did not produce a report; inspect its error above')
data = json.loads(report.read_text())
findings = [v for r in data.get('Results', []) for v in r.get('Vulnerabilities', [])]
print(f'{report.name}: {len(findings)} gated findings')
for v in findings:
    print(v['VulnerabilityID'], v['Severity'], v['PkgName'], 'installed='+v['InstalledVersion'], 'fixed='+v.get('FixedVersion', 'unavailable'))
