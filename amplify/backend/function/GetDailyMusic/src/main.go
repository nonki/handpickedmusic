package main

import (
	"context"
	"errors"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
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

// HandleRequest handles a request
func HandleRequest(ctx context.Context) (string, error) {
	client := newGraphqlClient()
	track, nextToken, err := getDailyTrack(ctx, client, nil)
	if track != nil {
		return track.SpotifyID, err
	}

	if err != nil {
		return "", err
	}

	for nextToken != nil {
		track, nextToken, err = getDailyTrack(ctx, client, nextToken)
		if track != nil {
			return track.SpotifyID, err
		}

		if err != nil {
			return "", err
		}
	}

	tracks, nextToken, err := getAllUnscheduledTracks(ctx, client, nil)
	if err != nil {
		return "", err
	}

	for nextToken != nil {
		var additionalTracks []Track
		additionalTracks, nextToken, err = getAllUnscheduledTracks(ctx, client, nextToken)
		if err != nil {
			return "", err
		}

		tracks = append(tracks, additionalTracks...)
	}

	newTrack := getRandomTrack(tracks)
	if err := setDailyTrack(ctx, client, newTrack); err != nil {
		return "", err
	}

	return newTrack.SpotifyID, nil
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

func getAllUnscheduledTracks(ctx context.Context, client *graphql.Client, nextToken *string) ([]Track, *string, error) {
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
		return nil, nextToken, errors.New("No tracks found")
	}

	return tracks, nextToken, nil
}

func getRandomTrack(tracks []Track) Track {
	seed := rand.NewSource(time.Now().UnixNano())
	seededRand := rand.New(seed)
	randomIndex := seededRand.Intn(len(tracks))
	return tracks[randomIndex]
}

func getDailyTrack(ctx context.Context, client *graphql.Client, nextToken *string) (*Track, *string, error) {
	req := graphql.NewRequest(`
		query myQuery ($date: String!, $nextToken: String){
			listTracks(filter: {date: {eq: $date}}, nextToken: $nextToken) {
				items {
					id,
					spotifyId,
					date,
				}
				nextToken
			}
		}
	`)

	date := time.Now().Format("2006-01-02")
	req.Var("date", date)
	req.Var("nextToken", nextToken)

	var respData struct {
		ListTracks struct {
			Items     []Track `json:"items"`
			NextToken *string `json:"nextToken"`
		} `json:"listTracks"`
	}

	req.Header.Set("X-API-KEY", os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIKEYOUTPUT"))
	if err := client.Run(ctx, req, &respData); err != nil {
		return nil, nil, err
	}

	tracks := respData.ListTracks.Items
	nextToken = respData.ListTracks.NextToken

	if len(tracks) == 0 {
		return nil, nextToken, nil
	}

	track := tracks[0]

	return &track, nextToken, nil
}

func setDailyTrack(ctx context.Context, client *graphql.Client, track Track) error {
	req := graphql.NewRequest(`
		mutation MyMutation ($id: ID!, $date: AWSDate!) {
			updateTrack(input: {id: $id, date: $date}) {
				id
			}
		}
	`)

	date := time.Now().Format("2006-01-02")
	req.Var("id", track.ID)
	req.Var("date", date)

	req.Header.Set("X-API-KEY", os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIKEYOUTPUT"))

	var respData interface{}
	return client.Run(ctx, req, &respData)
}

func main() {
	lambda.Start(HandleRequest)
}
