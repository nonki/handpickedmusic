
run:
	sam build
	sam local start-api --docker-network=lambda-local --env-vars env.json
