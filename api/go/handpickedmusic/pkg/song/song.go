package song

import (
	"encoding/json"
	"errors"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

const (
	ErrorSongInvalid = "song is invalid"
	ErrorSongAlreadyExists = "song already exists"
)

type Artist struct {
	Name string `json:"string"`
}

type Image struct {
	Size int `json:"size"`
	Url string `json:"url"`
}

type Album struct {
	Title string `json:"title"`
}

type Song struct {
	Title string `json:"title"`
	Artists []Artist `json:"artists"`
	Images []Image `json:"images"`
	Url string `json:"url"`
	Album Album `json:"album"`
	PreviewUrl string `json:"previewUrl"`
	Id string `json:"id"`
	Uri string `json:"uri"`
}

func FetchSong(id, tableName string, client dynamodbiface.DynamoDBAPI) (*Song, error) {
	input := &dynamodb.GetItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"id":{
				S: aws.String(id),
			},
		},
		TableName: aws.String(tableName),
	}

	result, err := client.GetItem(input)

	if err != nil {
		return nil, err
	}

	item := new(Song)
	err = dynamodbattribute.UnmarshalMap(result.Item, item)
	if err != nil {
		return nil, err
	}

	return item, nil
}

func CreateSong(req events.APIGatewayProxyRequest, tableName string, client dynamodbiface.DynamoDBAPI) (*Song, error) {
	var song Song
	if err := json.Unmarshal([]byte(req.Body), &song); err != nil {
		return nil, err
	}

	if !IsSongValid(song) {
		return nil, errors.New(ErrorSongInvalid)
	}

	currentSong, _ := FetchSong(song.Id, tableName, client)
	if currentSong != nil && len(currentSong.Id) != 0 {
		return nil, errors.New(ErrorSongAlreadyExists)
	}

	item, err := dynamodbattribute.MarshalMap(song)
	if err != nil {
		return nil, err
	}

	input := &dynamodb.PutItemInput{
		Item: item,
		TableName: aws.String(tableName),
	}

	_, err = client.PutItem(input)
	if err != nil {
		return nil, err
	}

	return nil, nil
}

func IsSongValid(song Song) bool {
	return true
}
