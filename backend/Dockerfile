FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libsqlite3-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN mkdir -p build && cd build && \
    cmake .. && \
    cmake --build . --config Release

EXPOSE 8080

CMD ["./build/studymate_server"]
