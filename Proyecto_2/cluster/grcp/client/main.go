package main

import (
	"context"
	"fmt"
	"log"

	pb "main/grpcClient"

	"github.com/gofiber/fiber/v2"
	"google.golang.org/grpc"
)

var ctx = context.Background()

type Data struct {
	Carnet   int32
	Nombre   string
	Curso    string
	Nota     int32
	Semestre string
	Year     int32
}

func insertData(c *fiber.Ctx) error {
	data := make(map[string]interface{})
	e := c.BodyParser(&data)
	if e != nil {
		return e
	}
	var carnetInt int32
	if carnetFloat, ok := data["carnet"].(float64); ok {
		carnetInt = int32(carnetFloat) // Convertir float64 a int32
		// Usa carnetInt como int32 en tu código.
	}

	var yearInt int32
	if yearFloat, ok := data["year"].(float64); ok {
		yearInt = int32(yearFloat) // Convertir float64 a int32
		// Usa carnetInt como int32 en tu código.
	}

	var notaInt int32
	if notaFloat, ok := data["nota"].(float64); ok {
		notaInt = int32(notaFloat) // Convertir float64 a int32
		// Usa notaInt como int32 en tu código.
	}

	nota := Data{
		Carnet:   carnetInt,
		Nombre:   data["nombre"].(string),
		Curso:    data["curso"].(string),
		Nota:     notaInt,
		Semestre: data["semestre"].(string),
		Year:     yearInt,
	}

	go sendMysqlServer(nota)

	return nil
}

func sendMysqlServer(nota Data) {
	conn, err := grpc.Dial("localhost:3001", grpc.WithInsecure(),
		grpc.WithBlock())
	if err != nil {
		log.Fatalln(err)
	}

	cl := pb.NewGetInfoClient(conn)
	defer func(conn *grpc.ClientConn) {
		err := conn.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}(conn)

	ret, err := cl.ReturnInfo(ctx, &pb.RequestId{
		Carnet:   nota.Carnet,
		Nombre:   nota.Nombre,
		Curso:    nota.Curso,
		Nota:     nota.Nota,
		Semestre: nota.Semestre,
		Year:     nota.Year,
	})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Respuesta del server " + ret.GetInfo())

}

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"res": "todo bien",
		})
	})

	app.Post("/insert", insertData)

	err := app.Listen(":3000")
	if err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
