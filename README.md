# directory-client

Client to interact with the user

## config

add following section to the `config/{env}.config` file

```JSON
"providers": {
    "directory": {
        "url": "http://api.openage.in/directory/v1/api", // prod url
        "role": {
            "key": "<presistant token>"
        }
    }
}
```

## usage

Get a role by key

```JavaScript

const client = require('@open-age/client')

const roleKey = 'xxx....xxx' // role key of the user

// impersonates the user
const role = await client.directory.roles.get(roleKey)
```
