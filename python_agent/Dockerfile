FROM python:3.11-slim

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml requirements.txt ./
RUN uv pip install --system -r requirements.txt

COPY . /app

EXPOSE 5000

CMD ["uv", "run", "python", "main.py"]
