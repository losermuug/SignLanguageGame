#!/usr/bin/env bash
set -euo pipefail

DEST="${1:-models/asl}"
mkdir -p "$DEST"

if ! command -v kaggle >/dev/null 2>&1; then
  echo "kaggle CLI is not installed. Install it with: python3 -m pip install kaggle" >&2
  exit 1
fi

kaggle kernels output gusthema/asl-fingerspelling-recognition-w-tensorflow -p "$DEST"
echo "Downloaded Kaggle output to $DEST"
