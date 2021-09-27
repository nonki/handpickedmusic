package main

import (
	"os"
	"fmt"

	"github.com/nonki/handpickedmusic/pkg/handlers"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

var (
	dynaClient dynamodbiface.DynamoDBAPI
)

func main() {
	region := os.Getenv("AWS_REGION")
	fmt.Printf("AWS_REGION: %s\n", region)

	config := &aws.Config{
		Region: aws.String(region),
	}

	ep := os.Getenv("DYNAMODB_ENDPOINT")
	fmt.Printf("DYNAMODB_ENDPOINT: %s\n", ep)

	if len(os.Getenv("DYNAMODB_ENDPOINT")) != 0 {
		config.Endpoint = aws.String(os.Getenv("DYNAMODB_ENDPOINT"))
	}

	awsSession, err := session.NewSession(config)
	if err != nil {
		return
	}

	dynaClient = dynamodb.New(awsSession)
	lambda.Start(handler)
}

const tableName = "HandpickedMusicSong"

func handler(req events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	switch req.HTTPMethod {
	case "GET":
		return handlers.GetSong(req, tableName, dynaClient)
	case "POST":
		return handlers.CreateSong(req, tableName, dynaClient)
	default:
		return handlers.UnhandledMethod()
	}
}

func apiResponse(msg string) (*events.APIGatewayProxyResponse, error) {
	return &events.APIGatewayProxyResponse{
		Body: msg,
		StatusCode: 200,
	}, nil
}
