package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
)

func main() {
	http.Handle("/health", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	fileRouter := mux.NewRouter()
	fileRouter.HandleFunc("/{filename:[a-zA-Z0-9_-]+}", readFileHandler)
	http.Handle("/", fileRouter)

	port := 8090
	fmt.Printf("Server listening on port %d...\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}

func readFileHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	fileName := vars["filename"]

	fileDirectory := os.Getenv("DOWNLOAD_PATH")
	if fileDirectory == "" {
		http.Error(w, "DOWNLOAD_PATH environment variable not set", http.StatusInternalServerError)
		return
	}

	filePath := filepath.Join(fileDirectory, fileName)

	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	defer file.Close()

	fileContent, err := os.ReadFile(filePath)
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}

	contentType := http.DetectContentType(fileContent)
	w.Header().Set("Content-Type", contentType)

	w.WriteHeader(http.StatusOK)
	_, err = w.Write(fileContent)
	if err != nil {
		http.Error(w, "Error writing response", http.StatusInternalServerError)
		return
	}
	fmt.Printf("Returned image for %s\n", fileName)
}
