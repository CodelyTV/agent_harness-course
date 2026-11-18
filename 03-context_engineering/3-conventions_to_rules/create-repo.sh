#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
	echo "Usage: ./create-repo.sh <target directory>" >&2
	exit 1
fi

node "$(dirname "$0")/source/build-history.mjs" "$1"
cd "$1"
npm install
