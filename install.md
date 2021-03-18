# Dependencies

* [Node.js](https://nodejs.org/en/download/ "Node.js download"), version 6.9.0 or newer.
* [MongoDB Shell](https://www.mongodb.com/try/download/shell "MongoDB Shell download"), version 4.4.2 or newer - this should be running as a service when deploying this application.

# Setting up authentication
To set up user authentication go to <https://manage.auth0.com/>.

1. Create a single page JavaScript web application.
2. Go to application settings.
3. Put "%YOURDOMAIN%:%YOURPORT%/auth/callback" in the "Allowed Callbacks URLs" box.
4. Put "%YOURDOMAIN%:%YOURPORT%" in the "Allowed Logout URLs" box.
5. Put "%YOURDOMAIN&:%YOURPORT%" in the "Allowed Web Origins" box.
6. Save changes.

# Running the application

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
        "domain": "{string} user defined",
        "port": "{integer} user defined"
    },
    "auth": {
        "clientID": "{string} from auth0",
        "clientSecret": "{string} from auth0",
        "domain": "{string} from auth0"
    },
    "db": {
        "domain": "{string} user defined",
        "port": "{integer} user defined",
        "name": "{string} user defined"
    },
    "junction": ["{string} list of entrance ids"],
    "auditMode": "{boolean} set to true to run in audit mode"
}
```

Create the headlessUsers.json file in the server directory. Add any users that require headless login to this json. The password string should be unencrypted in this file, when login requests are made the passwords should be encrypted using MD5 encryption.

## headlessUsers.json structure
```json
[
    {
        "username": "{string} user defined",
        "password": "{string} user defined"
    }
]
```

Initiliase the database by using the command:
```bash
npm run db_init
```

The database can be populated by test data by using the command:
```bash
npm run db_populate
```

Run the application on the specified domain using the command: 
```bash
npm start
```

A message should appear in the console saying the address the server is running on.