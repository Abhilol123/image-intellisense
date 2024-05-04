FROM golang:1.21 AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o main

EXPOSE 8090

CMD ["./main"]
