package main

import (
	"context"
	"errors"
	"math/rand"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/machinebox/graphql"
)

// AWSDate is a representation of the AWSDate gql type in AWS Amplify
type AWSDate string

// Track is a representation of the Track model in gql
type Track struct {
	ID   string  `json:"id"`
	Date AWSDate `json:"date"`
}

// HandleRequest handles a request
func HandleRequest(ctx context.Context) (string, error) {
	client := graphql.NewClient(os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIENDPOINTOUTPUT"))

	req := graphql.NewRequest(`
	query myQuery {
		listTracks(filter: {date: {notContains: ""}}) {
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
	if len(tracks) == 0 {
		return "", errors.New("No tracks found")
	}

	seed := rand.NewSource(time.Now().UnixNano())
	seededRand := rand.New(seed)
	randomIndex := seededRand.Intn(len(tracks))

	return tracks[randomIndex].ID, nil
}

func main() {
	lambda.Start(HandleRequest)
}
