# Docker Configuration

## Runtime Environment Variables

This application supports runtime environment variable injection, meaning you can configure the API URL when starting the Docker container without rebuilding the image.

### Environment Variables

- `API_BASE_URL` - The base URL for the API (e.g., `https://api.survivor.tools`)

### Usage

#### Using Docker Run

```bash
docker run -d \
  -p 80:80 \
  -e API_BASE_URL=https://your-api-url.com \
  your-image-name
```

#### Using Docker Compose

```yaml
version: '3.8'
services:
  web:
    image: your-image-name
    ports:
      - "80:80"
    environment:
      - API_BASE_URL=https://your-api-url.com
```

### How It Works

1. The `inject-env.sh` script runs at container startup
2. It creates an `env-config.js` file with the runtime environment variables
3. The application loads this file before starting and uses these values
4. Falls back to build-time `VITE_API_BASE_URL` if runtime value is not set

### Dockerfile Integration

To use this in your Dockerfile, ensure the inject script runs before starting nginx:

```dockerfile
# Copy the injection script
COPY inject-env.sh /docker-entrypoint.d/01-inject-env.sh
RUN chmod +x /docker-entrypoint.d/01-inject-env.sh
```

The script will automatically run when the container starts if placed in `/docker-entrypoint.d/`.
