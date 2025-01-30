package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Rep-G/asteria/internal/api"
	"github.com/gorilla/mux"
)

func main() {
	database.InitRedis()

	r := mux.NewRouter()
	r.HandleFunc("/fortnite/api/game/v2/profile/{accountId}/client/QueryProfile", api.QueryProfileHandler).Methods("POST")
	r.HandleFunc("/fortnite/api/game/v2/matchmaking/account/{accountId}", api.MatchmakingHandler).Methods("GET")

	fmt.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
