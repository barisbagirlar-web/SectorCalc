#!/bin/bash
MAX_RETRIES=5
RETRY_DELAY=30
for i in $(seq 1 $MAX_RETRIES); do
  echo "Deploy attempt $i of $MAX_RETRIES..."
  rm -f .next-deploy.lock
  node scripts/deploy-production.mjs
  if [ $? -eq 0 ]; then
    echo "Deploy successful!"
    exit 0
  fi
  echo "Deploy failed. Waiting $RETRY_DELAY seconds before retrying..."
  sleep $RETRY_DELAY
done
echo "All deploy attempts failed."
exit 1
