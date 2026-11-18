#!/usr/bin/env bash
set -euo pipefail

usage() {
	echo "Usage: ./create-repo.sh <before|question|after> <target directory>" >&2
	echo "  before    history up to the deterministify install, ready to run /deterministify conventions" >&2
	echo "  question  before + a headless run that stops at the question, to resume with 'claude --resume <id>'" >&2
	echo "  after     before + the commits /deterministify conventions made after answering yes" >&2
	exit 1
}

[ $# -eq 2 ] || usage

mode="$1"
here="$(cd "$(dirname "$0")" && pwd)"
target="$2"

case "$mode" in
before | question | after) ;;
*) usage ;;
esac

node "$here/history/build-history.mjs" "$target"
cd "$target"

if [ "$mode" = "after" ]; then
	GIT_COMMITTER_NAME="Irene Sanz" GIT_COMMITTER_EMAIL="irene.sanz@example.com" \
		git -c commit.gpgsign=false am --quiet --committer-date-is-author-date "$here"/history/after/*.patch
fi

npm install --no-audit --no-fund

if [ "$mode" = "question" ]; then
	echo "Running /deterministify conventions until it asks its question (about 15 minutes)…"
	session_id="$(uuidgen | tr '[:upper:]' '[:lower:]')"
	claude -p "/deterministify conventions" --session-id "$session_id" --permission-mode bypassPermissions
	echo "$session_id" >.git/deterministify-session
	echo
	echo "Done. To answer the question, run inside $target:"
	echo "  claude --resume $session_id"
fi
