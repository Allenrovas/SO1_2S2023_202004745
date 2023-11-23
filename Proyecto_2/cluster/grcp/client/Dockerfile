FROM golang:1.19-alpine

WORKDIR /app

COPY . .

RUN go build -o main .

EXPOSE 3000

CMD ["./main"]