package main

import (
	"context"
	"os"
	"time"

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
	Code        string `json:"code"`
	RedirectURI string `json:"redirectUri"`
}

type Auth struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	Expiry       string `json:"expiry"`
}

func HandleRequest(ctx context.Context, req Event) (*Auth, error) {
	token, err := GetToken(req.Arguments.Code, req.Arguments.RedirectURI)
	if err != nil {
		return nil, err
	}

	return &Auth{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		Expiry:       token.Expiry.Format(time.RFC3339),
	}, nil
}

func GetToken(code, redirectURI string) (*oauth2.Token, error) {
	clientID, clientSecret, err := getSpotifySecrets()
	if err != nil {
		return nil, errors.Wrap(err, "error getting spotify secrets")
	}

	auth := spotify.NewAuthenticator(redirectURI, "")
	auth.SetAuthInfo(clientID, clientSecret)
	return auth.Exchange(code)
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
