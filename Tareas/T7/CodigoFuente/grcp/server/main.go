package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"

	pb "main/grpc-server"

	_ "github.com/go-sql-driver/mysql"
	"google.golang.org/grpc"
)

var ctx = context.Background()
var db *sql.DB

type server struct {
	pb.UnimplementedGetInfoServer
}

const (
	port = ":3001"
)

type Data struct {
	Carnet   int32
	Nombre   string
	Curso    string
	Nota     int32
	Semestre string
	Year     int32
}

func mysqlConnect() {
	// Cambia las credenciales según tu configuración de MySQL
	dbUser := "root"
	dbPassword := "DARV02ag*"
	dbHost := "35.231.250.238"
	dbPort := "3306"
	dbName := "tarea7"
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalln(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Conexión a MySQL exitosa")
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí nota de: ", in.GetNombre())
	data := Data{
		Year:     in.GetYear(),
		Semestre: in.GetSemestre(),
		Nota:     in.GetNota(),
		Curso:    in.GetCurso(),
		Nombre:   in.GetNombre(),
		Carnet:   in.GetCarnet(),
	}
	insertMySQL(data)
	return &pb.ReplyInfo{Info: "Hola cliente, recibí la nota."}, nil
}

func insertMySQL(nota Data) {
	// Prepara la consulta SQL para la inserción en MySQL
	query := "INSERT INTO nota (carnet, anio, nombre, curso, nota, semestre) VALUES (?, ?, ?, ?, ?, ?)"
	_, err := db.ExecContext(ctx, query, nota.Carnet, nota.Year, nota.Nombre, nota.Curso, nota.Nota, nota.Semestre)
	if err != nil {
		log.Println("Error al insertar en MySQL:", err)
	}
}

func main() {
	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	mysqlConnect()

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}
}
