using environment variables in run command
> docker run -e PORT=3003 -e APP_NAME="another awesome express app" -d -p 3003:3003 --name express-3003 express

environment variables in .env file
> docker run --env-file ".env-prod" -d -p 3003:8080 --name express-3003-prod express