# Use a base image with Docker installed
FROM --platform=$BUILDPLATFORM docker

# Install Docker Compose (if not already installed)
RUN apk add --no-cache curl && \
    curl -L "https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Copy your docker-compose files
COPY docker-compose.yml /app/docker-compose.yml
COPY docker-compose.override.yml /app/docker-compose.override.yml

# Copy your app code (optional — if you need it)
COPY . /app

# Set working directory
WORKDIR /app

# Run docker-compose up in background
CMD ["docker", "compose", "up", "-d"]
