package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image/jpeg"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/EdlinOrg/prominentcolor"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/pkg/errors"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

type Event struct {
	SpotifyID spotify.ID `json:"spotifyId"`
}

type EnrichedTrack struct {
	ColorHex   string     `json:"colorHex"`
	SpotifyID  spotify.ID `json:"spotifyId"`
	TrackName  string     `json:"trackName"`
	ArtistName string     `json:"artistName"`
	AlbumName  string     `json:"albumName"`
	PreviewURL string     `json:"previewUrl"`
}

func HandleRequest(ctx context.Context, req Event) (*EnrichedTrack, error) {
	client, err := NewSpotifyClient()
	if err != nil {
		return nil, errors.Wrap(err, "error getting spotfy client")
	}

	track, err := client.GetTrack(req.SpotifyID)
	if err != nil {
		return nil, errors.Wrap(err, "error getting spotify track")
	}

	enrichedTrack := enrichTrack(track)

	return &enrichedTrack, nil
}

func enrichTrack(track *spotify.FullTrack) EnrichedTrack {
	var artists []string
	for _, v := range track.Artists {
		artists = append(artists, v.Name)
	}

	colorHex, err := prominentColour(track.Album.Images[0].URL)
	if err != nil {
		colorHex = "FFFFFF"
	}

	return EnrichedTrack{
		SpotifyID:  track.ID,
		ColorHex:   colorHex,
		TrackName:  track.Name,
		ArtistName: strings.Join(artists, " & "),
		AlbumName:  track.Album.Name,
		PreviewURL: track.PreviewURL,
	}
}

func prominentColour(url string) (string, error) {
	file, err := downloadFile(url)
	if err != nil {
		return "", err
	}

	data := base64.StdEncoding.EncodeToString(file)
	imageDecoder := base64.NewDecoder(base64.StdEncoding, strings.NewReader(data))

	img, err := jpeg.Decode(imageDecoder)
	if err != nil {
		return "", err
	}

	colors, err := prominentcolor.Kmeans(img)
	if err != nil {
		return "", err
	}

	return colors[0].AsString(), nil
}

func downloadFile(url string) ([]byte, error) {
	res, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return nil, errors.New("Non 200 http response")
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

func NewSpotifyClient() (*spotify.Client, error) {
	clientID, clientSecret, err := getSpotifySecrets()
	if err != nil {
		return nil, errors.Wrap(err, "error getting spotify secrets")
	}

	client := &http.Client{}

	data := url.Values{}
	data.Set("grant_type", "client_credentials")

	req, _ := http.NewRequest(http.MethodPost, spotify.TokenURL, strings.NewReader(data.Encode()))

	authString := fmt.Sprintf("%s:%s", clientID, clientSecret)
	authHeader := fmt.Sprintf("Basic %s", base64.StdEncoding.EncodeToString([]byte(authString)))
	req.Header.Set("Authorization", authHeader)

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return nil, errors.Wrap(err, "error making post request for access token")
	}

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return nil, errors.New(fmt.Sprintf("Got error code %d - %s", resp.StatusCode, body))
	}

	defer resp.Body.Close()

	var tokenData oauth2.Token
	if err = json.NewDecoder(resp.Body).Decode(&tokenData); err != nil {
		body, _ := io.ReadAll(resp.Body)
		return nil, errors.Wrap(err, fmt.Sprintf("error unmarsheling json data: %s", body))
	}

	auth := spotify.NewAuthenticator("", "")
	spotifyClient := auth.NewClient(&tokenData)
	return &spotifyClient, nil
}

func getSpotifySecrets() (clientID, clientSecret string, err error) {
	withDecryption := true
	mySession := session.Must(session.NewSession())
	svc := ssm.New(mySession)
	spotifyAPIIDName := os.Getenv("spotifyApiId")
	spotifyAPIKeyName := os.Getenv("spotifyApiKey")

	input := ssm.GetParametersInput{
		Names: []*string{
			&spotifyAPIIDName,
			&spotifyAPIKeyName,
		},

		WithDecryption: &withDecryption,
	}

	output, err := svc.GetParameters(&input)
	if err != nil {
		return "", "", err
	}

	secrets := map[string]string{}
	for _, v := range output.Parameters {
		secrets[*v.Name] = *v.Value
	}

	return secrets[spotifyAPIIDName], secrets[spotifyAPIKeyName], nil
}

func main() {
	lambda.Start(HandleRequest)
}
