#!/bin/bash
cd "$(dirname "$0")/.."
echo "Starting local full-page screenshot server on http://localhost:3456 (keep this window open)"
node server/index.js
