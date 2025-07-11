FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM python:3.12-slim AS backend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/pyproject.toml backend/uv.lock ./
RUN pip install uv && uv pip install --system --no-cache -r pyproject.toml

COPY ./backend /app/backend

FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends nginx && rm -rf /var/lib/apt/lists/*

COPY --from=frontend-build /app/dist /var/www/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=backend-build /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=backend-build /usr/local/bin/ /usr/local/bin/
COPY --from=backend-build /app /app

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 80 8000

CMD ["./start.sh"]
