# SectorCalc Math Kernel — Cloud Run Deployment
#
# Memory leak prevention:
#   --max-requests 1000: Recycles workers every 1000 requests
#     to prevent mpmath.iv interval arithmetic from accumulating
#     stale memory references (mpmath internal caches).
#   --max-requests-jitter 50: Avoids thundering herd on restart.
#
# Concurrency:
#   -w 4: Four Gunicorn workers for concurrent MMS test requests.
#   -k uvicorn.workers.UvicornWorker: ASGI-compatible worker.

FROM python:3.11-slim

WORKDIR /app

# Copy kernel files
COPY elite_engine.py math_models.py interval_engine.py mms_generator.py api.py ./
COPY requirements.txt ./

# Install production dependencies only
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8081/health')" || exit 1

# Non-root user for security
RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Gunicorn + Uvicorn with memory leak prevention
# --max-requests: recycle workers to prevent mpmath.iv memory leaks
CMD ["gunicorn", \
     "-w", "4", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "50", \
     "--timeout", "30", \
     "--graceful-timeout", "15", \
     "--bind", "0.0.0.0:8081", \
     "api:app"]
