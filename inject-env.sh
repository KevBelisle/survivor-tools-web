#!/bin/sh
# Script to inject runtime environment variables into the built app
# This allows environment variables to be set when the Docker container starts
# instead of at build time

# Create env-config.js with runtime environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = {
  API_BASE_URL: "${API_BASE_URL}"
};
EOF

echo "Runtime environment variables injected:"
cat /usr/share/nginx/html/env-config.js
