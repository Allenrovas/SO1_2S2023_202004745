package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type User struct {
	Carnet int
	Nombre string
}

type allTasks []User

var tasks = allTasks{
	{
		Carnet: 202004745,
		Nombre: "Allen Giankarlo Roman Vasquez",
	},
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(tasks)
}

func indexRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Bienvenido a mi API")
}

func main() {

	// Rutas
	router := mux.NewRouter().StrictSlash(true)
	//Endpoints
	router.HandleFunc("/", indexRoute)
	router.HandleFunc("/data", getTasks).Methods("GET")

	//Servidor
	fmt.Println("Servidor corriendo en el puerto 3000")
	log.Fatal(http.ListenAndServe(":3000", router))

}
