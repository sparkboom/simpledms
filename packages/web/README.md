# `@sparkboom-smds/server`

> TODO: description

## REST Requests

```
GET http://localhost:8000 HTTP/1.1

###

GET http://localhost:8000/docu HTTP/1.1

###

GET http://localhost:8000/document/6068ca3a08198032bf392064 HTTP/1.1

###

GET http://localhost:8000/documents HTTP/1.1

###

POST http://localhost:8000/documents HTTP/1.1
content-type: application/json

{
    "name": "sample",
    "time": "Wed, 21 Oct 2015 18:27:50 GMT"
}

```

## GraphQL Requests

```graphql
{
  __schema {
    types {
      name
    }
  }
}
```
