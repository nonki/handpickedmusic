package handlers

import ()

func test() string {
	return "test"
}
package handlers

import (
	"github.com/nonki/handpickedmusic/pkg/user"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

var ErrorMethodNotAllowed = "method Not allowed"

type ErrorBody struct {
	ErrorMsg *string `json:"error,omitempty"`
}

func GetSong(req events.APIGatewayProxyRequest, tableName string, dynaClient dynamodbiface.DynamoDBAPI) (
	*events.APIGatewayProxyResponse,
	error,
) {
	return &events.APIGatewayProxyResponse{}, nil
}

func CreateSong(req events.APIGatewayProxyRequest, tableName string, dynaClient dynamodbiface.DynamoDBAPI) (
	*events.APIGatewayProxyResponse,
	error,
) {
	return &events.APIGatewayProxyResponse{}, nil
}

func UpdateSong(req events.APIGatewayProxyRequest, tableName string, dynaClient dynamodbiface.DynamoDBAPI) (
	*events.APIGatewayProxyResponse,
	error,
) {
	return &events.APIGatewayProxyResponse{}, nil
}

func DeleteSong(req events.APIGatewayProxyRequest, tableName string, dynaClient dynamodbiface.DynamoDBAPI) (
	*events.APIGatewayProxyResponse,
	error,
) {
	return &events.APIGatewayProxyResponse{}, nil
}

func UnhandledMethod() (*events.APIGatewayProxyResponse, error) {
	return apiResponse(http.StatusMethodNotAllowed, ErrorMethodNotAllowed)
}
