package main

import (
	"context"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
)

func HandleRequest(ctx context.Context) (string, error) {
	return fmt.Sprintf("API_URL: %s\nAPI_KEY: %s", os.Getenv("API_URL"), os.Getenv("API_handndpickedmusic_GRAPHQLAPIKEYOUTPUT")), nil
}

func main() {
	lambda.Start(HandleRequest)
}
