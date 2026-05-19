# Multi-service image that contains Node.js and Python for backend inference
FROM node:18-bullseye

ENV DEBIAN_FRONTEND=noninteractive

# Install Python and system deps required by librosa/soundfile
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      python3 python3-pip python3-dev build-essential pkg-config \
      libsndfile1 ffmpeg && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy repository
COPY . /app

# Install backend dependencies and build TypeScript
WORKDIR /app/backend
RUN npm ci --no-audit --no-fund || npm install && npm run build

# Install Python requirements for inference
WORKDIR /app/DURIAN_RIPENESS_CLASSIFICATION
RUN python -m pip install --upgrade pip setuptools wheel && \
    if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

# Final workdir and start server
WORKDIR /app/backend
EXPOSE 8080
CMD ["node", "dist/server.js"]
