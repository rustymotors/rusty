#!/bin/bash

# Ensure the environment variable is set
if [ -z "$NX_CLOUD_AUTH_TOKEN" ]; then
  echo "Error: NX_CLOUD_AUTH_TOKEN is not set."
  exit 1
fi

# Replace the placeholder in nx.json with the environment variable value
sed -i 's/__NX_CLOUD_AUTH_TOKEN__/'"$NX_CLOUD_AUTH_TOKEN"'/g' nx.json

echo "Token has been securely injected into nx.json."