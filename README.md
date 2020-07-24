# Twitter Prototype API

graphql-twitter-api is a lightweight example of how a Twitter backend might work using Node.js, Auth0 and Graphql.

## Getting started

1. Install Node.js
2. Clone repo and Install dependencies

        git clone git@github.com:valverdesan/graphql-twitter-backend.git
        npm install

3. Create config file with Auth0 credentials from your Auth0 Account
4. Run server

        npm start
    
Server should start and display this message:

    🚀 Server ready at http://localhost:4000/graphql

## Using the API and Routes

Rather than have separate routes or endpoints like a REST API, this minimalist GraphQL API has just one endpoint (http://localhost:4000/graphql). See the example below for a curl command. 

    curl \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNfTGpTZ3YtUHowMEVsSkh5bUwyayJ9.eyJpc3MiOiJodHRwczovL2Rldi1zZWdvdmlhLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJmVG5mQkpNWmtrRVlyY0o3d3JnM3dFZ0xwd2pESUE4S0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9ncWwtdHdpdHRlci1hcGkiLCJpYXQiOjE1OTU0NDU4MDAsImV4cCI6MTU5NTUzMjIwMCwiYXpwIjoiZlRuZkJKTVpra0VZcmNKN3dyZzN3RWdMcHdqRElBOEsiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.IyspRrxhFk4N5vmeu34FY82srAD6dBO_snT1EX1MdsvrB0pEURkO3pl12IWFSalMWYr12Kk13fLR6dlA-XNuJMtoNGtI688OZMwcuwoSs4sJ35gFYkW_ZQdGgJgOoM0WBP9Cxny0VQb1sJ_3MdAe1DqQdCUK3KuUItW12k0xs2hsYPfay8uuEPPzjsaNUFts1rrXGPl6_DzAHNxkvV71jZkbDEU2y2Gxtd7RcykSZ2fOijo_G3ZjrrdDrLUjNZyXVZH5HaYPF8wysJUmlkrNfmaawqgoo5EjegFvvcdOZYa-5lGq2AoPiu34mK0-6PBNfsGkSIIPJ05Uzi-zQAEoQQ" \
    --data '{ "query": "{tweets(userId: 1) {id,userId,text,timestamp}}"}' \
    http://localhost:4000/graphql


## API Methods

### Create User / Signup

Graphql Query: 

    mutation {
        createUser(
            name: "Joel Valverde"
            email: "example123@gmail.com"
            password: "Password123456"
        ) {
            status
            userId
        }
    }

Response:

    {
    "data": {
        "createUser": {
        "status": "Successfully created user for email example123@gmail.com",
        "userId": 3
        }
    }
    }

### Login User / Signup
After creating a user, you'll then want to login the user so you can access posts within the site.

    query {
        loginUser(
            email: "example123@gmail.com"
            password: "Password123456"
        ) {
            status
            token
            userId
        }
    }

Response:

    {
    "data": {
        "loginUser": {
        "status": "Login Succeeded",
        "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNfTGpTZ3YtUHowMEVsSkh5bUwyayJ9.eyJpc3MiOiJodHRwczovL2Rldi1zZWdvdmlhLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJmVG5mQkpNWmtrRVlyY0o3d3JnM3dFZ0xwd2pESUE4S0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9ncWwtdHdpdHRlci1hcGkiLCJpYXQiOjE1OTU2MjgxMTcsImV4cCI6MTU5NTcxNDUxNywiYXpwIjoiZlRuZkJKTVpra0VZcmNKN3dyZzN3RWdMcHdqRElBOEsiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.V42dDr4nF35IrZOAsaSkQBf0gCdHVdOChulgKMfZxmPA4E0bQz8rSjcjtg9Dy66qh1esnKNSFii1_fpPkp6rZW8ZhWKGCKTN-jgOgdQ-xtuYwwBFjnSs_j1FBzCmuPSj2SSakGsOLUQ3BAS7PmXQq5AgTBvn7f55YLRUfoq0tv_a29mUsPw1xPwzVL5786xt4hhRuLrEm3UzONLO7s15c7KN1ofk02pa_4R2TEVsp_gelwOB3nMsozj6Bb7OPCVATaGiyUOYPNRDMeu2K3K2jKNiShNec6x_rAHG5vCW4R_3NhAyYQIuyOgzd6IYJO2rALWd5eXtlFQ_nGSxesoHNw",
        "userId": 3
        }
    }
    }

### Tweet a tweet!

In order to tweet, you'll need to have a valid token which was generated in the previous step, during login. In other words, the header must contain the JWT that came back from the login response.

    {
        "Authorization": "Bearer eyJhbG...nGSxesoHNw"
    }


GraphQL Input:

    mutation {
        postTweet(
            userId: 3
            text: "The force is strong with this one."
        ) {
            status
            userId
            tweetId
        }
    }

Successful Response:

    {
        "data": {
            "postTweet": {
            "status": "Success",
            "userId": 3,
            "tweetId": 3
            }
        }
    }

Unauthorized Response, with invalid token header:

    {
        "error": {
            "errors": [
            {
                "message": "JsonWebTokenError: invalid token",
                "locations": [
                {
                    "line": 2,
                    "column": 3
                }
                ],
                "path": [
                "postTweet"
                ]
            }
            ],
            "data": null
        }
    }

### Get All Tweets for a user.

GraphQL Input:

    query {
        tweets(userId: 1) {
            id
            userId
            text
            timestamp
        }
    }

Response:

    {
        "data": {
            "tweets": [
            {
                "id": "1",
                "userId": 1,
                "text": "Only a Sith deals in absolutes.",
                "timestamp": 1595629031
            },
            {
                "id": "3",
                "userId": 1,
                "text": "These Aren’t The Droids You’re Looking For.",
                "timestamp": 1595629033
            }
            ]
        }
    }

### Edit a specific tweet.

Graphql Input:

    mutation {
        editTweet(
            tweetId: 2
            updatedText: "It’s not impossible. I used to bullseye womp rats in my T-16 back home, they’re not much bigger than 2 yards."
        ) {
            id,
            userId,
            text,
            timestamp
        }
    }

Response:

    {
        "data": {
            "editTweet": {
            "id": "2",
            "userId": 2,
            "text": "It’s not impossible. I used to bullseye womp rats in my T-16 back home, they’re not much bigger than 2 yards.",
            "timestamp": 1595629032
            }
        }
    }