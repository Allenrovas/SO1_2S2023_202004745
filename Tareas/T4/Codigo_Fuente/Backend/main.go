package main

import (
	"fmt"
	"os/exec"
	"time"
)

func main() {
	// Lanzar un goroutine que ejecute la función cada n segundos
	interval := 3 // segundos
	ticker := time.NewTicker(time.Second * time.Duration(interval))
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			fmt.Print("\033[32m") // Cambia el color del texto a verde
			fmt.Printf("DATOS OBTENIDOS DESDE EL MODULO: %s\n", time.Now().Format("2006-01-02 15:04:05"))
			fmt.Print("\033[0m") // Restaura el color de texto predeterminado
			fmt.Println("")

			cmd := exec.Command("sh", "-c", "cat /proc/ram_202004745")
			out, err := cmd.CombinedOutput()
			if err != nil {
				fmt.Println(err)
			}
			output := string(out[:])
			fmt.Println(output)
		}
	}
}
