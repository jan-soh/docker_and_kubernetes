FROM node:22-alpine as build

WORKDIR /app
COPY package*.json .
# normally we would use "npm ci" here, but the react version used here has some dependency issues
RUN npm install --force

COPY . .
RUN npm run build


# Difference:
#
# 1. RUN (Build-time)
#  • Purpose: Executes commands during the image build process.
#  • Result: Each RUN instruction creates a new layer on top of the current image and commits the results.
#  • Common Use Cases: Installing packages (apt-get install), creating directories, or compiling source code.
#
# 2. CMD (Runtime)
#  • Purpose: Sets the default command to be executed when the container starts.
#  • Result: It does not execute anything during the build process; it only defines what should happen when you run the container.
#  • Common Use Cases: Starting a web server, running a script, or launching an application.
#  • Execution: It runs every time you execute docker run.
#  • Behavior: There can only be one CMD instruction in a Dockerfile.dev. If you list more than one, only the last one takes effect. Crucially, CMD can be overridden by arguments passed to docker run.
#
FROM nginx:1.27.0

COPY --from=build /app/build /usr/share/nginx/html

