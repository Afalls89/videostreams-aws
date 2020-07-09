# `Video streams`

To construct and host a service to check how many video streams a given user is watching and prevent a user from watching more than three video streams concurrently. The Information stored includes session_ID, user_ID and stream count. functionality will involve the ability to:

### - `request information on the endpoints , by navigating to this link`

https://videostreams.herokuapp.com/api

This will serve up the endpoints.json file in this repo

### - `request whether a new stream is allowed by making requests to this endpoint with the user's ID as a parametric endpoint (must be a number)`

https://videostreams.herokuapp.com/api/startstream/:user_id

if the user is allowed to start another video stream (stream count isn't above 3), an object like this will be returned.

```
{
    streamStatus: {
        isNewStreamAllowed: true,
        streamCount: 1,
        },
    }
```

if the user is not allowed to start another video stream (stream count is already 3), an object like this will be returned.

```
{
    streamStatus: {
        isNewStreamAllowed: false,
        streamCount: 3,
        },
    }
```

### - `notify the service that a stream has been closed by making requests to this endpoint with the user's ID as a parametric endpoint (must be a number)`

https://videostreams.herokuapp.com/api/endstream/:user_id

if the user has one video stream open and notifys the service that a video stream has been closed , an object like this will be returned.

```
{
    streamStatus: {
        msg: "stream closed",
        streamCount: 0,
        },
    }
```

---

## `Getting Started`

These instructions will provide you with a copy of the project on your local machine for development and testing purposes. See deployment for a link to a hosted system. notes on how to deploy the project on a live system.

On your local machine using terminal navigate to the directory where you want the repository to be situated.

in the terminal type:

```bash
git clone <Repository URL>

npm i

```

### `Prerequisites`

Node.js version needs to be v12.10.0 or higher.

PostgresSQL will need to be installed locally on your machine to setup a local database

https://www.postgresql.org/download/

dependencies that need to be installed to run the application:

- express: ^4.17.1,
- knex: ^0.21.1,
- pg: ^8.2.1

Dev-dependencies that need to be installed to run the applications test suite:

- jest: ^26.1.0,
- supertest: ^4.0.2

---

### `Create a local database`

Use the credentialsTemplate.js to create a credentials.js file containing your psql username and password

run the following script:

```
npm run setup-dbs
```

you can use the following scripts to roll your database version forwards (latest) and backwards (rollback):

```
npm run migrate-latest

npm run migrate-rollback
```

Once you have migrated to the latest version , seed the Database with test data by running the following script:

```
npm run seed
```

---

## `Running the tests`

In order to run the application tests, run the following scripts:

- NB in order for the tests to run properly the local database needs to be running and seeded with the testData

```

npm test
```

## `Deployment on Heroku`

install Heroku CLI

```
curl https://cli-assets.heroku.com/install.sh | sh
```

login to heroku

```
heroku login
heroku: Press any key to open up the browser to login or q to exit
```

navigate to your apps directory and run heroku create (make note of the app name created)

```
cd ~/myapp
heroku create
```

attach a postgresSQL instance to your heroku app (make a note of the postgres name )

```
heroku addons:create heroku-postgresql:hobby-dev
```

deploy code (make note of the URL generated for your app)
this command can also be used to update your app

```
git push heroku master
```

Push your local database into the hosted postgres DB

```
heroku pg:push videostreams [DATABASE_URL] --app [APP NAME]
```

## `Links`

Please click here for the Hosted database:

[Heroku] https://videostreams.herokuapp.com/api - link to hosted webpage

[Github] https://github.com/Afalls89/videotreams - Github repository

## `Next steps and Scaling`

To expand this application to an enterprise level I would look to deploy the application onto either AWS or GCP.

With AWS the application would take the form of a Lamda function with the Database being a non-SQL DynamoDB.
I would then look to put the application behind a load balancer that would distribute the requests between various Regions Availability zones.

For example having a load balancer to serve London would distribute requests across zones eu-west2a,eu-west2b and eu-west2c.

This would make the application Highly available in the sense that it is fault tolerant and easily accessible from that region.
To expand this concept further I would look to have instances of the application in various aws regions across the globe with the same load balancing in effect.

Terraform would be the way I would look to deploy this infrastructure, this ensures the infrastructure setup is version controlled and easily deployable.

If this application was expanded in this way I also look to improve the security of the application by implementing Json Web Tokens to verify the origin of the the request to start/close a video stream. In addition I would look to encrypt the user ID being attached to the request.

## `Authors`

- **Andrew Falls** - _Initial work_ - [Afalls89](https://github.com/Afalls89)
