package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	graphql "github.com/machinebox/graphql"
)

type Track struct {
	ID string `json:"id"`
}

func HandleRequest(ctx context.Context) ([]Track, error) {
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
		return []Track{}, err
	}

	return respData.ListTracks.Items, nil
}

func main() {
	lambda.Start(HandleRequest)
}
