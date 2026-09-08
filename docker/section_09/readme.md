> npx create-react-app --template typescript containerize-react-app

> cd containerize-react-app

> npm start

npm start just executes the "start" script defined in package.json which is in fact this line
"start": "react-scripts start"
Looking at the dependencies in package.json, there is a dependency on react-scripts
Those scripts can then be found in the node_modules/react-scripts/scripts folder

To create the production build, simply run
> npm run build

To run this build a production server is needed, for instance:
> npx http-server@14.1.1 build

This will not have hot reloading, but it will be enough to test the build.
