#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"
PORT="${PORT:-3000}"
DIST_DIR="$PROJECT_DIR/dist"
METADATA_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"

run() { /usr/bin/time -p "$@"; }

[[ "$PORT" =~ ^[0-9]+$ ]] || { echo "PORT must be a number: $PORT" >&2; exit 1; }
run mkdir -p "$DIST_DIR" "$METADATA_DIR"

if [[ -f package.json ]]; then
  if [[ -f package-lock.json ]]; then
    run npm ci --no-audit --no-fund
  else
    run npm install --no-audit --no-fund
  fi
  if node -e "process.exit(require('./package.json').scripts?.build ? 0 : 1)"; then
    run npm run build
  fi
else
  echo 'No package.json: this static project has no dependencies to install.'
  run cp "$PROJECT_DIR/index.html" "$DIST_DIR/index.html"
fi

run python3 -c 'import json,os,sys,tempfile; project,directory,out=sys.argv[1:]; data={"project":project,"directory":directory}; fd,tmp=tempfile.mkstemp(dir=out,prefix="deployment-output."); f=os.fdopen(fd,"w"); json.dump(data,f); f.write("\n"); f.close(); os.replace(tmp,os.path.join(out,"deployment-output.json"))' "$PROJECT_DIR" "$DIST_DIR" "$METADATA_DIR"
echo "Serving $DIST_DIR on 0.0.0.0:$PORT"
exec python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$DIST_DIR"
