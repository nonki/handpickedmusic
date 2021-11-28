package main

import (
	"context"
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
		queryTracks(filter: { not { has: date } }) {
			items {
				id
			}
		}
	}
	`)

	var respData struct {
		QueryTracks struct {
			Items []Track `json:"items"`
		} `json:"queryTracks"`
	}

	req.Header.Set("X-API-KEY", os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIKEYOUTPUT"))

	if err := client.Run(ctx, req, &respData); err != nil {
		return "", err
	}

	tracks := respData.QueryTracks.Items
	seed := rand.NewSource(time.Now().UnixNano())
	seededRand := rand.New(seed)
	randomIndex := seededRand.Intn(len(tracks))

	return respData.QueryTracks.Items[randomIndex].ID, nil
}

func main() {
	lambda.Start(HandleRequest)
}
