export type AmplifyDependentResourcesAttributes = {
    "api": {
        "handpickedmusic": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "function": {
        "GetDailyMusic": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "EnrichTrack": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "AlertLowRemainingTrackCount": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "CloudWatchEventRule": "string"
        }
    },
    "custom": {
        "handpickedmusicalerts": {
            "snsTopicArn": "string"
        }
    }
}