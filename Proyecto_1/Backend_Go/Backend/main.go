package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type Process struct {
	Pid     int    `json:"pid"`
	Nombre  string `json:"nombre"`
	Usuario string `json:"usuario"`
	Estado  string `json:"estado"`
	Ram     int    `json:"ram"`
	Padre   int    `json:"padre"`
}

type Cpu struct {
	Porcentaje int       `json:"Porcentaje_en_uso"`
	Procesos   []Process `json:"procesos"`
}

type Ram struct {
	Total      int `json:"Total_Ram"`
	En_uso     int `json:"Ram_en_Uso"`
	Libre      int `json:"Ram_libre"`
	Porcentaje int `json:"Porcentaje_en_uso"`
}

type KillRespuesta struct {
	Respuesta string `json:"respuesta"`
}

// Index
func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Server Online")
}

// KillProcess
func KillProcess(w http.ResponseWriter, r *http.Request) {

	fmt.Println(" ==================== KILL PROCESS ==================== ")
	fmt.Println(" ")

	vars := mux.Vars(r)
	pid := vars["pid"]

	cmdKill := exec.Command("sh", "-c", "kill -9 "+pid)
	outKill, err := cmdKill.CombinedOutput()
	var kill_info KillRespuesta
	kill_info.Respuesta = "Proceso eliminado con PID: " + pid + ""
	if err != nil {
		fmt.Println(err)
		kill_info.Respuesta = "Error al eliminar proceso con PID: " + pid + ""
	}
	fmt.Println(string(outKill))

	//Mandar respuesta
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(kill_info)
}

// postScheduledData
func postScheduledData() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			fmt.Println(" ==================== DATOS MODULO CPU ==================== ")
			fmt.Println(" ")

			cmdCpu := exec.Command("sh", "-c", "cat /proc/cpu_202004745")
			outCpu, err := cmdCpu.CombinedOutput()
			if err != nil {
				fmt.Println(err)
			}

			//---CPU
			fmt.Println("-------------------- CPU --------------------")
			var cpu_info Cpu
			err = json.Unmarshal([]byte(outCpu), &cpu_info)
			if err != nil {
				fmt.Println(err)
			}

			//Mandar respuesta
			url := "http://localhost:3001/cpu"
			//Mandar cpu_info que es un json
			jsonValue, _ := json.Marshal(cpu_info)
			//Mandar el json a la url
			resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonValue))
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println(resp)

			fmt.Println(" ==================== DATOS MODULO RAM ==================== ")
			fmt.Println(" ")

			cmdRam := exec.Command("sh", "-c", "cat /proc/ram_202004745")
			outRam, err := cmdRam.CombinedOutput()
			if err != nil {
				fmt.Println(err)
			}
			//---RAM
			fmt.Println("-------------------- RAM --------------------")
			var ram_info Ram
			err = json.Unmarshal([]byte(outRam), &ram_info)
			if err != nil {
				fmt.Println(err)
			}

			//Mandar respuesta
			url = "http://localhost:3001/ram"
			//Mandar ram_info que es un json
			jsonValue, _ = json.Marshal(ram_info)
			//Mandar el json a la url
			resp, err = http.Post(url, "application/json", bytes.NewBuffer(jsonValue))
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println(resp)

		}
	}
}

func main() {

	fmt.Println("Allen Giankarlo Roman Vasquez - 202004745 - SO1 Proyecto 1")
	router := mux.NewRouter().StrictSlash(true)
	//Endpoints
	router.HandleFunc("/", Index)
	router.HandleFunc("/kill/{pid}", KillProcess).Methods("POST")

	// Iniciar goroutine para solicitudes POST programadas
	go postScheduledData()

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	// Server
	fmt.Println("Server running on port 3000")
	log.Fatal(http.ListenAndServe(":3000", handlers.CORS(headers, methods, origins)(router)))

}
