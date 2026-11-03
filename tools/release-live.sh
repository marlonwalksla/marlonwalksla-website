#!/usr/bin/env bash
# Release test -> live, then prepare the head code with the new REL hash.
# Run from the repo root:  tools/release-live.sh
# Steps: (1) copy the test tree onto live as one commit, (2) put the new hash into tools/head-loader-v3.html,
# (3) clear jsDelivr for the changed files on @live. Then Claude writes the head code into Webflow
# (set_site_freeform_code), publishes the TEST site, runs tools/verify-head.sh, and Marlon publishes www + apex.
set -euo pipefail
git fetch -q origin test:refs/remotes/origin/test live:refs/remotes/origin/live
OLD=$(git rev-parse origin/live)
TREE=$(git rev-parse origin/test^{tree})
if [ "$TREE" = "$(git rev-parse origin/live^{tree})" ]; then echo "live already matches test"; exit 0; fi
NEW=$(git commit-tree "$TREE" -p origin/live -m "Release: test -> live")
git push -q origin "$NEW:refs/heads/live"
echo "live is now $NEW"
sed -i "s/var REL='[0-9a-f]\{40\}'/var REL='$NEW'/" tools/head-loader-v3.html
for f in $(git diff --name-only "$OLD" "$NEW" -- page-embeds); do
  curl -s "https://purge.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@live/$f" >/dev/null && echo "purged $f"
done
echo "NEW REL: $NEW"
echo "Next: Claude sets the head code in Webflow, publishes test, runs tools/verify-head.sh."
