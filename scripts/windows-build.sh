#!/bin/sh
echo "Building Docker image for $1 service"
LOCATION=asia-southeast1
PROJECT_ID=niftyzone-v1
REPOSITORY=niftyzone
IMAGE=$1
TAG=$(cat versions.json | python -c "import sys, json; print(json.load(sys.stdin)['$1'])")
CANONICAL_TAG="$LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$TAG"

if docker manifest inspect $CANONICAL_TAG > /dev/null; then
  echo "Tag exists"
  exit 0
fi

echo Canonical tag: $CANONICAL_TAG

# change context to project root
cd ..
cd /docker

# uncomment below line to build on local machine
DOCKER_BUILDKIT=1 docker buildx build --platform=linux/amd64 --file Dockerfile -t $CANONICAL_TAG .

# uncomment below line to build on remote server
# DOCKER_BUILDKIT=1 docker buildx build --builder amd64_builder --file apps/$1/Dockerfile -t $CANONICAL_TAG .

echo "Done!"
echo Canonical tag: $CANONICAL_TAG