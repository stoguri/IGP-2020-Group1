# Dependencies

* Node.js, version 6.9.0 or newer.

# Setting up authentication
To set up user authentication go to <https://manage.auth0.com/>.

1. Create a single page web application.
2. Go to application settings.
3. Put %YOURDOMAIN%:%YOURPORT%/auth/callback in the "Allowed Callbacks URLs" box.
4. Put %YOURDOMAIN%:%YOURPORT%/auth/logout in the "Allowed Logout URLs" box.
5. Save changes.

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

## Config.json structure
```json
{
    "network": {
        "domain": "user defined",
        "port": "user defined"
    },
    "auth": {
        "clientID": "from auth0",
        "clientSecret": "from auth0",
        "domain": "from auth0"
    },
    "testMode": "set to true to run in test mode"
}
```

Run the application on the specified domain using the command: 
```bash
npm start
```

A message should appear in the console saying the address the server is running on.