# Dependencies

* [Node.js](https://nodejs.org/en/download/ "Node.js download"), version 6.9.0 or newer.
* [MongoDB Shell](https://www.mongodb.com/try/download/shell "MongoDB Shell download"), version 4.4.2 or newer - this should be running as a service when deploying this application.

# Setting up Auth0 authentication
To set up user authentication go to <https://manage.auth0.com/>.

1. Create a single page JavaScript web application.
2. Go to application settings.
3. Put "%CLIENTPROTOCOL%://%CLIENTDOMAIN%:%CLIENTPORT%/auth/callback" in the "Allowed Callbacks URLs" box, for example "http://localhost:8081/auth/callback".
4. Save changes.

# Deploying the application

Navigate to the desired install directory.

You can download the zip from <https://github.com/stoguri/IGP-2020-Group1>.

Or you can clone the repository using the command: 
```bash
git clone https://github.com/stoguri/IGP-2020-Group1
```

Navigate into the repository and install the npm packages using the command:
```bash
npm install
```

Create the config.json file in the server directory.

## config.json structure
```json
{
    "network": {
            "server": {
            "domain": "{string} user defined",
            "port": "{integer} user defined",
            "protocol": "{string} web protocol, user defined"
        },
        "client": {
            "domain": "{string} user defined",
            "port": "{integer} user defined",
            "protocol": "{string} web protocol, user defined"
        }
    },
    "auth": {
        "clientID": "{string} from auth0",
        "clientSecret": "{string} from auth0",
        "domain": "{string} from auth0",
        "encryptionMethod": "{string} user defined, must be supported by the version of OpenSSL on the platform. Eg. 'sha1', 'md5'." 
    },
    "db": {
        "domain": "{string} user defined",
        "port": "{integer} user defined",
        "name": "{string} user defined"
    },
    "entrances": ["{[string]} list of entrance ids"],
    "operationMode": "{string} deployment, audit or test"
}
```

Create the users.json file in the server directory. Add Auth0 users and headless users to this json. Auth0 users are users that can authenticated with the graphical Auth0 strategy, this will be any end users. Headless users are users that cannot use the Auth0 strategy to login, the inference network should be one of these users.

There are three permission levels for a user: writer, admin and basic. A writer user can only send vehicle information to the application, this is the role of inference network. The admin and basic users are both end users, they may both use the API functions that serve vehicle data. The admin user has some additional privaledges these are:

* Add and remove basic users.
* Change the mode of operation.

The password string should be unencrypted in this file, when login requests are made the passwords should be encrypted using the encryption method specified in the config.json.

## users.json structure
```json
{
    "users": [
        {
            "id": "Google ID",
            "permission": "{string} user defined - must be admin or basic"
        }
    ],
    "users_headless": [
        {
            "id": "inferenceNetwork",
            "password": "password123",
            "permission": "writer"
        }
    ]
}
```

Initiliase the database by using the command:
```bash
npm run db_init
```

The database can be populated by test data by using the command:
```bash
npm run db_populate
```

The application can be tested by using the command:
```bash
npm test
```

Run the application using the commands: 
```bash
npm run start_server
npm run start_client
```

A message should appear in the console saying the address the server is running on.