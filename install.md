# How to read this document

Throughout this document variables are denoted by a string in block capitals within a '%', the values of each of these variables are defined in the document and will depend on the setup of your application.

There are definitions of two JSONS in this document, the values of the keys are described using the following notation:

```json
{
    "key": "{string} your name"
}
```

This notation conveys that the key of the JSON is of the datatype denoted in braces in this case string, where the value is your name.

# Dependencies

* [Node.js](https://nodejs.org/en/download/ "Node.js download"), version 6.9.0 or newer.
* [MongoDB Shell](https://www.mongodb.com/try/download/shell "MongoDB Shell download"), version 4.4.2 or newer - this should be running as a service when deploying this application.

# Information requirements

To set up and deploy this application you must have the following information available to you.

* A domain (%DOMAIN%, %PROTOCOL%), running on HTTPS for deployment, HTTP can be used for testing.
* A client port (%CLIENTPORT%).
* A server port (%SERVERPORT%), for HTTP or HTTPS connections.
* A MongoDB port (%DBPORT%).

# Setting up Auth0 authentication
To set up user authentication go to <https://manage.auth0.com/>.

## Create a single page application 

1. Create a single page JavaScript web application.
2. Go to application settings, the name of the application is not used in the application. Some information here will be used later.
    i. Domain (%APPLICATIONDOMAIN%).
    ii. Client ID (%CLIENTID%)
    iii. Client Secret (%CLIENTSECRET%).
3. Put "%PROTOCOL%://%DOMAIN%:%CLIENTPORT%", or "%PROTOCOL%://%DOMAIN% if the port is 80 and the protocol is HTTP or if the port is 443 and the protocol is HTTPS - in the "Allowed Callbacks URLs" box. For example "http://localhost:8081".
4. Put "%PROTOCOL%://%DOMAIN% in the "Allowed Callbacks URLs" box.
5. Put "%PROTOCOL%://%DOMAIN%:%CLIENTPORT%" in the "Allowed Logout URLs" box.
6. Save changes.

## Create an API

1. Under the Applications tab open APIs and create a new API, the name of the API is not used in the application, however the identifer will be. Some information here will be used later.
    i. Identifier (%APIIDENTIFIER%).
2. Under permissions add the following permissions:
* create:vehicle
* read:vehicle
* create:user

## Create a rule
1. Open the Auth Pipeline tab and click on Rules.
2. Create a new rule, select empty rule, the name of the rule is not used in the application. Enter this code:

```javascript
function emailDomainWhitelist(user, context, callback) {

  // Access should only be granted to verified users.
  if (!user.email || !user.email_verified) {
    return callback(new UnauthorizedError('Access denied.'));
  }
	
  //authorized user emails
  const whitelist = [ 
    'example@email.com',
    'example2@email.com'
  ]; 
  
  const userHasAccess = whitelist.some(
      function (item) {
        const email = user.email;
        return email.toLowerCase() === item;
      });

  if (!userHasAccess) {
    context.redirect = {
    	url: "https://%APPLICATIONDOMAIN%/v2/logout?federated"
  	};
  } else {
  	return callback(null, user, context);
  }
}
```

3. Add emails to the whitelist for users that you want to be able to access the application.

## Create roles

There are three user roles: writer, admin and basic. A writer user can only send vehicle information to the application, this is the role of inference network. The admin and basic users are both end users, they may both use the API functions that serve vehicle data. The admin user has some additional privaledges these are:

* Add and remove basic users.
* Change the mode of operation.

1. Go to the User Management tab and open Roles. 

2. Create a role called "Writer" and go to the Permissions tab and add: 
* create:vehicle

3. Create a role called "Admin" and go to the Permissions tab and add: 
* read:vehicle
* create:user

4. Create a role called "Basic" and go to the Permissions tab and add: 
* read:vehicle

## Create users

1. Go to the User Management tab and open Users. 
2. Create a user.
* If you create a user here you will have to supply an email and a password. 
* If you come back to this menu after deploying the application then any users who have logged in with the Google login will also appear.

## Assign roles

1. Go to the User Management tab and open Roles. 
2. Click a role.
3. Go to the Users tab.
4. Click ADD USERS.
5. Search for a user and then click assign.

## Create a machine to machine application for the inference network

1. Go to the Applications tab and open Applications.
2. Click CREATE APPLICATION and choose Machine to Machine Applcations. 
3. Name your application whatever you like and click CREATE. 
4. You will then be prompted to select an authorized API, select the API you create earlier, select the create vehicle permission and click AUTHORIZE to finish.

Take note of the Domain, Client ID and Client Secret for setting up the inference network.

# Deploying the application

Navigate to the desired install directory.

You can download the zip from <https://github.com/stoguri/IGP-2020-Group1>.

Or you can clone the repository using the command: 
```bash
git clone https://github.com/stoguri/IGP-2020-Group1
```

Navigate into the repository and run the setup script using the command:
```bash
npm run setup
```

Create the config.json file in the /client/src/ directory.

## config.json structure
```json
{
    "network": {
        "server": {
            "domain": "{string} user defined, %DOMAIN%",
            "http": {
                "port": "{integer} user defined, %SERVERHTTPPORT%"
            },
            "https": {
                "port": "{integer} user defined, %SERVERHTTPSPORT%",
                "domain": "{string} user defined, registered domain pointing to local domain, target of SSL certification",
                "certificate": "{string} absolute path to cert",
                "key": "{string} absolute path to privkey",
                "ca": "{string} absolute path to chain"
            }
        },
        "client": {
            "domain": "{string} user defined, %DOMAIN%",
            "port": "{integer} user defined, %CLIENTPORT%",
        }
    },
    "auth": {
        "clientID": "{string} from auth0, client ID of application, %CLIENTID%",
        "clientSecret": "{string} from auth0, client secret of application, %CLIENTSECRET",
        "domain": "{string} from auth0, domain of application, APPLICATIONDOMAIN",
        "api":{
            "identifier": "{string} from auth0, identifier of API, %APIIDENTIFIER%"
        },
        "encryptionMethod": "{string} user defined, must be supported by the version of OpenSSL on the platform. Eg. 'sha1', 'md5'."
    },
    "db": {
        "domain": "{string} user defined, %DOMAIN%",
        "port": "{integer} user defined, %DBPORT%",
        "name": "{string} user defined, name of the database"
    },
    "entrances": ["{[string]} list of entrance ids"],
    "operationMode": "{string} deployment, audit or test"
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

A message should appear in the console saying the address the client application and server is running on.