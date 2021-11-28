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
	ID        string  `json:"id"`
	SpotifyID string  `json:"spotifyId"`
	Date      AWSDate `json:"date"`
}

// HandleRequest handles a request
func HandleRequest(ctx context.Context) (string, error) {
	client := graphql.NewClient(os.Getenv("API_HANDPICKEDMUSIC_GRAPHQLAPIENDPOINTOUTPUT"))
	if track, err := getDailyTrack(ctx, client); track != nil {
		return track.SpotifyID, err
	}

	tracks, err := getAllUnscheduledTracks(ctx, client)
	if err != nil {
		return "", err
	}

	track := getRandomTrack(tracks)
	if err := setDailyTrack(ctx, client, track); err != nil {
		return "", err
	}

	return track.SpotifyID, nil
}

func getAllUnscheduledTracks(ctx context.Context, client *graphql.Client) ([]Track, error) {
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

func getRandomTrack(tracks []Track) Track {
	seed := rand.NewSource(time.Now().UnixNano())
	seededRand := rand.New(seed)
	randomIndex := seededRand.Intn(len(tracks))
	return tracks[randomIndex]
}

func getDailyTrack(ctx context.Context, client *graphql.Client) (*Track, error) {
	req := graphql.NewRequest(`
		query myQuery ($date: String!){
			listTracks(filter: {date: {eq: $date}}) {
				items {
					id,
					spotifyId,
					date,
				}
			}
		}
	`)

	date := time.Now().Format("2006-01-02")
	req.Var("date", date)

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
		return nil, errors.New("No track found")
	}

	track := tracks[0]

	return &track, nil
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
