package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sns"
	"github.com/machinebox/graphql"
)

// AWSDate is a representation of the AWSDate gql type in AWS Amplify
type AWSDate string

// Track is a representation of the Track model in gql
type Track struct {
	ID        string  `json:"id"`
	SpotifyID string  `json:"spotifyId"`
	Date      AWSDate `json:"date"`
}

func HandleRequest(ctx context.Context) (string, error) {
	remainingTracks, err := getRemainingTracks(ctx)
	if err != nil {
		sendMessage(fmt.Sprintf("failed checking remaining tracks: %s", err.Error()))
		return "", err
	}

	message := fmt.Sprintf("Unscheduled tracks remaining: %d", len(remainingTracks))
	if len(remainingTracks) < 20 && os.Getenv("SEND_EMAIL") == "yes" {
		err := sendMessage(message)
		return message, err
	}

	return message, nil
}

func getRemainingTracks(ctx context.Context) ([]Track, error) {
	client := newGraphqlClient()
	req := graphql.NewRequest(`
	query myQuery {
		listTracks(filter: {date: {notContains: ""}}) {
			items {
				id,
				spotifyId,
				date,
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
		return nil, err
	}

	tracks := respData.ListTracks.Items

	if len(tracks) == 0 {
		return nil, errors.New("No tracks found")
	}

	return tracks, nil

}

func newGraphqlClient() *graphql.Client {
	httpClient := &http.Client{
		Timeout: 2 * time.Second,
	}

	return graphql.NewClient(
		os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIENDPOINTOUTPUT"),
		graphql.WithHTTPClient(httpClient),
	)
}

func newSNSClient() *sns.SNS {
	mySession := session.Must(session.NewSession())
	return sns.New(mySession)
}

func sendMessage(message string) error {
	client := newSNSClient()

	subject := "ALERT: handpickedmusi.cc alert (LOW REMAINING TRACK COUNT)"
	topicArn := "arn:aws:sns:eu-central-1:234566038455:handpickedmusic-alerts"
	input := &sns.PublishInput{
		Message:  &message,
		Subject:  &subject,
		TopicArn: &topicArn,
	}

	_, err := client.Publish(input)

	return err
}

func main() {
	lambda.Start(HandleRequest)
}
