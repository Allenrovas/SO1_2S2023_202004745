package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var conexion = ConectarBD()

func ConectarBD() *sql.DB {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	conexionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)
	//conexionString := "root:secret@tcp(localhost:3306)/Discos?parseTime=True"
	conexion, err := sql.Open("mysql", conexionString)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Conexion con MySQL Correcta")
	}
	return conexion
}

type Disco struct {
	Id     int    `json:"id"`
	Title  string `json:"title"`
	Artist string `json:"artist"`
	Year   int    `json:"yearR"`
	Genre  string `json:"genre"`
}

type Respuesta struct {
	Mensaje string `json:"mensaje"`
}

func indexRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Bienvenido a mi API")
}

func Registro(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var discoReg Disco
	var respuesta Respuesta

	json.NewDecoder((request.Body)).Decode(&discoReg)
	respuesta.Mensaje = "Registro Exitoso"

	query := `INSERT INTO discos (title, artist, yearR, genre) VALUES (?,?,?,?);`
	result, err := conexion.Exec(query, discoReg.Title, discoReg.Artist, discoReg.Year, discoReg.Genre)
	if err != nil {
		fmt.Println(err)
		respuesta.Mensaje = "Error al registrar"
	}
	fmt.Println(result)
	fmt.Println(respuesta)
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(http.StatusCreated)
	json.NewEncoder(response).Encode(respuesta)
}

func GetDiscos(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var lista []Disco
	query := "select * from discos;"
	result, err := conexion.Query(query)
	if err != nil {
		fmt.Println(err)
	}

	for result.Next() {
		var discoDevuelto Disco

		err = result.Scan(&discoDevuelto.Id, &discoDevuelto.Title, &discoDevuelto.Artist, &discoDevuelto.Year, &discoDevuelto.Genre)
		if err != nil {
			fmt.Println(err)
		}
		lista = append(lista, discoDevuelto)
	}
	json.NewEncoder(response).Encode(lista)
}

func main() {
	// Rutas
	router := mux.NewRouter().StrictSlash(true)
	// Endpoints
	router.HandleFunc("/", indexRoute)
	router.HandleFunc("/discos", GetDiscos).Methods("GET")
	router.HandleFunc("/registro", Registro).Methods("POST")

	//Servidor
	fmt.Println("Servidor corriendo en el puerto 8000")
	handler := cors.Default().Handler(router)
	log.Fatal((http.ListenAndServe(":8000", handler)))
	http.Handle("/", router)

}
