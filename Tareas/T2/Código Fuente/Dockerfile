FROM golang:1.20.3

WORKDIR /app

COPY . .

RUN go build -o main .

CMD ["./main"]