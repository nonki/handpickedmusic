package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/pkg/errors"
	"github.com/zmb3/spotify"
	"golang.org/x/oauth2"
)

type Event struct {
	Field     string       `json:"fieldName"`
	Arguments argumentsObj `json:"arguments"`
}

type argumentsObj struct {
	Token       string `json:"token"`
	RedirectURI string `json:"redirectUri"`
}

type Auth struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"`
}

func HandleRequest(ctx context.Context, req Event) (string, error) {
	token, err := GetToken(req.Arguments.Token, req.Arguments.RedirectURI)
	if err != nil {
		return "", err
	}

	return &Auth{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresIn:    token.Expiry.format("2006-01-02"),
	}, nil
}

func GetToken(token, redirectURI string) (*oauth2.Token, error) {
	clientID, clientSecret, err := getSpotifySecrets()
	if err != nil {
		return nil, errors.Wrap(err, "error getting spotify secrets")
	}

	client := &http.Client{}

	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("code", token)
	data.Set("redirect_uri", redirectURI)

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

	return &tokenData, nil
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
