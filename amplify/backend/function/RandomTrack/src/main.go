package main

import (
	"context"
	"math/rand"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	graphql "github.com/machinebox/graphql"
)

type Track struct {
	ID string `json:"id"`
}

func HandleRequest(ctx context.Context) (string, error) {
	client := graphql.NewClient(os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIENDPOINTOUTPUT"))

	req := graphql.NewRequest(`
	query myQuery {
		listTracks {
			items {
				id
			}
		}
	}
	`)

	var respData struct {
		ListTracks struct {
			Items []Track `json:"items"`
		} `json:"listTracks"`
	}

	req.Header.Set("X-API-KEY", os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIKEYOUTPUT"))

	if err := client.Run(ctx, req, &respData); err != nil {
		return "", err
	}

	tracks := respData.ListTracks.Items
	seed := rand.NewSource(time.Now().UnixNano())
	seededRand := rand.New(seed)
	randomIndex := seededRand.Intn(len(tracks))

	return respData.ListTracks.Items[randomIndex].ID, nil
}

func main() {
	lambda.Start(HandleRequest)
}
