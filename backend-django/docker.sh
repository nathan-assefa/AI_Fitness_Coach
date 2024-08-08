#!/bin/bash

FILE="/home/ubuntu/ptmx_backend/.env"

if [ ! -f "$FILE" ]; then
    echo "Error: The file '$FILE' does not exist." >&2
    exit 1
fi

IMAGE_NAME="ptmx_backend-web"

# Get the current image ID used by the service
CURRENT_IMAGE_ID=$(docker images "$IMAGE_NAME" -q)

# Stop and remove all containers, networks, and volumes defined in the docker-compose.yml
docker-compose down

# Build and recreate the service
docker-compose up -d --force-recreate --no-deps --build

# Get the new image ID
NEW_IMAGE_ID=$(docker images "$IMAGE_NAME" -q)

# Check if the new image ID is different from the current image ID
if [ "$NEW_IMAGE_ID" != "$CURRENT_IMAGE_ID" ]; then
    # If they are different and the current image ID is not empty, delete the old image
    if [ ! -z "$CURRENT_IMAGE_ID" ]; then
        echo "Deleting previous image: $CURRENT_IMAGE_ID"
        docker rmi "$CURRENT_IMAGE_ID"
    fi
else
    echo "Image ID has not changed."
fi