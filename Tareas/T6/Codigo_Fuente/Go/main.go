package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-redis/redis"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var client *redis.Client

type Album struct {
	Album  string `json:"album"`
	Artist string `json:"artist"`
	Year   string `json:"year"`
}

// Index
func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Server Online")
}

func addAlbumHandler(w http.ResponseWriter, r *http.Request) {
	var albumData Album

	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	// Decodifica los datos del álbum desde el cuerpo de la solicitud
	err := json.NewDecoder(r.Body).Decode(&albumData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	albumDataMap := map[string]interface{}{
		"album":  albumData.Album,
		"artist": albumData.Artist,
		"year":   albumData.Year,
	}

	// Almacena los datos del álbum en Redis
	err = client.HMSet(albumData.Album, albumDataMap).Err()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Responde con un mensaje de éxito
	fmt.Fprintf(w, "Álbum almacenado en Redis")
}

func main() {
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	fmt.Println("Allen Giankarlo Roman Vasquez - 202004745 - SO1 Proyecto 1")
	router := mux.NewRouter().StrictSlash(true)
	//Endpoints
	router.HandleFunc("/", Index)
	router.HandleFunc("/addAlbum", addAlbumHandler).Methods("POST")

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	// Server
	fmt.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(headers, methods, origins)(router)))

}
