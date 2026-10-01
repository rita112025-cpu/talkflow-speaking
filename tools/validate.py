#!/usr/bin/env python3
from __future__ import annotations
import json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / 'talkflow'
errors = []

required = [
    'index.html','manifest.webmanifest','sw.js','icon.svg','icon-192.png','icon-512.png',
    'css/app.css','js/icons.js','js/data.js','js/store.js','js/speech.js','js/ui.js',
    'js/views1.js','js/views2.js','js/app.js'
]
for rel in required:
    if not (APP / rel).is_file(): errors.append(f'missing: {rel}')

try:
    manifest = json.loads((APP/'manifest.webmanifest').read_text(encoding='utf-8'))
    if manifest.get('scope') != './': errors.append('manifest scope must be ./')
    if not str(manifest.get('start_url','')).startswith('./'): errors.append('manifest start_url must be relative')
except Exception as e:
    errors.append(f'manifest invalid: {e}')

html = (APP/'index.html').read_text(encoding='utf-8')
# Validate local script/css/manifest references without requiring external packages.
for url in re.findall(r'''(?:src|href)=["']([^"']+)["']''', html):
    if url.startswith(('http://','https://','#','data:')): continue
    if not (APP / url.split('?',1)[0]).exists(): errors.append(f'index reference missing: {url}')

node = shutil.which('node')
if node:
    for js in sorted((APP/'js').glob('*.js')):
        r = subprocess.run([node, '--check', str(js)], capture_output=True, text=True)
        if r.returncode: errors.append(f'JS syntax: {js.name}: {r.stderr.strip()}')
else:
    print('WARN: node not found; skipped JavaScript syntax check')

if errors:
    print('FAIL')
    for e in errors: print('-', e)
    sys.exit(1)
print('PASS: TalkFlow static validation')
print(f'- required files: {len(required)}/{len(required)}')
print('- manifest: valid')
print('- index local references: valid')
print('- JavaScript syntax: ' + ('valid' if node else 'not checked'))
