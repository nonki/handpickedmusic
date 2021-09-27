package handlers

import (
	"github.com/nonki/handpickedmusic/pkg/song"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

var ErrorMethodNotAllowed = "method Not allowed"

type ErrorBody struct {
	ErrorMsg *string `json:"error,omitempty"`
}

func GetSong(req events.APIGatewayProxyRequest, tableName string, client dynamodbiface.DynamoDBAPI) (
	*events.APIGatewayProxyResponse,
	error,
) {
	id := req.QueryStringParameters["id"]
	if len(id) > 0 {
		result, err := song.FetchSong(id, tableName, client)
		if err != nil {
			return apiResponse(http.StatusBadRequest, ErrorBody{
				aws.String(err.Error()),
			})
		}

		return apiResponse(http.StatusOK, result)

	}

	return apiResponse(http.StatusBadRequest, ErrorBody{
		aws.String("unsupported get request"),
	})
}

func CreateSong(req events.APIGatewayProxyRequest, tableName string, client dynamodbiface.DynamoDBAPI) (
	*events.APIGatewayProxyResponse,
	error,
) {
	result, err := song.CreateSong(req, tableName, client)
	if err != nil {
		return apiResponse(http.StatusBadRequest, ErrorBody{
			aws.String(err.Error()),
		})
	}

	return apiResponse(http.StatusCreated, result)
}

func UnhandledMethod() (*events.APIGatewayProxyResponse, error) {
	return apiResponse(http.StatusMethodNotAllowed, ErrorMethodNotAllowed)
}
