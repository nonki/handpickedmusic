package main

import (
	"context"
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
	remainingTracks, nextToken, err := getRemainingTracks(ctx, nil)
	if err != nil {
		sendMessage(fmt.Sprintf("failed checking remaining tracks: %s", err.Error()))
		return "", err
	}

	for nextToken != nil {
		var additionalTracks []Track
		additionalTracks, nextToken, err = getRemainingTracks(ctx, nextToken)
		if err != nil {
			sendMessage(fmt.Sprintf("failed checking remaining tracks: %s", err.Error()))
			return "", err
		}

		remainingTracks = append(remainingTracks, additionalTracks...)
	}

	message := fmt.Sprintf("Unscheduled tracks remaining: %d", len(remainingTracks))
	if len(remainingTracks) < 20 && os.Getenv("SEND_EMAIL") == "yes" {
		err := sendMessage(message)
		return message, err
	}

	return message, nil
}

func getRemainingTracks(ctx context.Context, nextToken *string) ([]Track, *string, error) {
	client := newGraphqlClient()
	req := graphql.NewRequest(`
	query myQuery ($nextToken: String) {
		listTracks(filter: {date: {notContains: ""}}, nextToken: $nextToken) {
			items {
				id,
				spotifyId,
				date,
			}
			nextToken	
		}
	}
	`)

	var respData struct {
		ListTracks struct {
			Items     []Track `json:"items"`
			NextToken *string `json:"nextToken"`
		} `json:"listTracks"`
	}

	req.Header.Set("X-API-KEY", os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIKEYOUTPUT"))
	req.Var("nextToken", nextToken)

	if err := client.Run(ctx, req, &respData); err != nil {
		return nil, nil, err
	}

	tracks := respData.ListTracks.Items
	nextToken = respData.ListTracks.NextToken

	if len(tracks) == 0 {
		return nil, nextToken, nil
	}

	return tracks, nextToken, nil
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

	subject := fmt.Sprintf("%s ALERT: handpickedmusi.cc alert (LOW REMAINING TRACK COUNT)", os.Getenv("ENV"))
	topicArn := os.Getenv("TOPIC_ARN")
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
