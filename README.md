#Umbrelapp Backend
Umbrerall is a demo application that allows you to get information about the current weather situation.

##Routes and Controllers
###Routes
At `application\config\route.json` add an entry to the json having the following fields

```
"^route_name^":{
  "get":{
    "require":"^a path for the controller file to be required^"
    "function": "^the method to be called^"
  },
  "post":{
    "require":"^a path for the controller file to be required^"
    "function": "^the method to be called^"
  },
  "patch":{
    "require":"^a path for the controller file to be required^"
    "function": "^the method to be called^"
  },
  "delete":{
    "require":"^a path for the controller file to be required^"
    "function": "^the method to be called^"
  },
}
```
The entry above mention for each http method we specify a function mentioned on `function` field from file `require`. If we do not want to use an http method we use null.

Eg if we do not want to do something on http *post* action then we specify if like this

```
"^route_id^":{
  "get":{
    "require":"^a path for the controller file to be required^"
    "function": "^the method to be called^"
  },
  "post":null,
  "patch":{
    "require":"^a path for the controller file to be required^"
    "function": "^the method to be called^"
  },
  "delete":{
    "require":"^a path for the controller file to be required^"
    "function": "^the method to be called^"
  },
}
```
For more info look below.

####Examples
When we visit http://localhost:8080/weather we want:
* On a http *GET* Request to use the method `get` from file `application/controllers/weather.js`
* On a http *POST* Request to use the method `post` from the same file mentioned above.
* On a http *PATCH* Request to use the method `patch` from the same file mentioned above.
* On a http *DELETE* Request to use the method `delete` from the same file mentioned above.

So the `application\config\route.json` will have the following structure:

```
"weather":{
  "get":{
    "require":"application/controllers/weather.js"
    "function":"get"
  },
  "post":{
    "require":"application/controllers/weather.js"
    "function":"post"
  },
  "patch":{
    "require":"application/controllers/weather.js"
    "function":"patch"
  },
  "delete":{
    "require":"application/controllers/weather.js"
    "function":"delete"
  },
}
```

And the controller will have the following:

```
module.exports={
  "get":function()
  {
    //Do some stuff here
  },
  "post":function()
  {
    //Do some stuff here
  },
  "patch":function()
  {
   //Do some stuff here  
  },
  "delete":function()
  {
    //Do some stuff here
  }
}
```

Please use the example above as an example.
