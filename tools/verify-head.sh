#!/usr/bin/env bash
# Checks that the head code published on the test site is byte-for-byte tools/head-loader-v3.html.
# Run after Claude writes the head code and publishes the test site:  tools/verify-head.sh
set -euo pipefail
sleep "${1:-30}"
curl -s "https://marlonwalksla.webflow.io/?x=$RANDOM" -o /tmp/th.html
python3 - <<'PY'
h=open('/tmp/th.html',encoding='utf-8').read()
want=open('tools/head-loader-v3.html',encoding='utf-8').read()
if want in h:
    import re
    print("OK: published head code matches the file. REL =", re.search(r"var REL='([0-9a-f]{40})'",want).group(1))
else:
    s=h.find(want[:60]); print("MISMATCH. start found:", s>=0)
    if s>=0:
        got=h[s:s+len(want)+200]
        for i,(a,b) in enumerate(zip(want,got)):
            if a!=b: print("first difference at char",i,repr(want[i-40:i+40]),'vs',repr(got[i-40:i+40])); break
    raise SystemExit(1)
PY
