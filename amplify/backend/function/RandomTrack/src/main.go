package main

import (
	"context"

	"github.com/aws/aws-lambda-go/lambda"
)

type Track struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	SpotifyID string `json:"spotifyId"`
}

func HandleRequest(ctx context.Context) (Track, error) {
	track := Track{
		ID:        "123",
		Name:      "My Track",
		SpotifyID: "spotify-123",
	}

	return track, nil
}

func main() {
	lambda.Start(HandleRequest)
}
