#!/bin/bash

# Start nginx in the background
nginx -g "daemon off;" &

# Start the backend server
cd /app/backend
uv run uvicorn main:app --host 0.0.0.0 --port 8000
