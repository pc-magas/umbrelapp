#Umbrelapp Backend
Umbrerall is a demo application that allows you to get information about the current weather situation.

The api is accessible via `8000` network port.

## Requirements
* Postgresql:
    * On Debian/Ubuntu Gnu/Linux distributions just type:

```
sudo apt-get install postgresql
```
* Node.js 6.9.1

## How to run

You just do the following steps:
1. Install depedencies
2. Configure database

## 1. Install depedencies
Just do the following

```
cd ^project_path^
npm install
```

## 2. Database Configuration

### Set database credentials

In order to configure the database connection the following enviromental variables must be exported:

Variable Name | Description
------------- | ------------
UMBRELAPP_DB_HOST | The host for the database
UMBRELAPP_DB_USER | The database user
UMBRELAPP_DB_PASSWD | The database password
UMBRELAPP_DB_NAME | The name of the database

On GNU/Linux and similar systems you can run the application by the following ways:

* Via `export` command (copy paste the commands one by one):

````
export UMBRELAPP_DB_HOST=^host^
export UMBRELAPP_DB_USER=^username^
export UMBRELAPP_DB_PASSWD=^password^
export UMBRELAPP_DB_NAME=^database_name^
node main.js
````
* Via `env` command:

````
 env UMBRELAPP_DB_HOST=^host^ UMBRELAPP_DB_USER=^username^ UMBRELAPP_DB_PASSWD=^password^ UMBRELAPP_DB_NAME=^database_name^ node main.js
````
In both cases you just replace the values in `^` with the apropriate value **without** the `^`.

### Import database schema
On a GNU/Linux or similar run:

```
export UMBRELAPP_DB_HOST=^host^
export UMBRELAPP_DB_USER=^username^
export UMBRELAPP_DB_PASSWD=^password^
export UMBRELAPP_DB_NAME=^database_name^
psql -h${UMBRELAPP_DB_HOST} -U ${UMBRELAPP_DB_USER} -W${UMBRELAPP_DB_PASSWD} -d${UMBRELAPP_DB_NAME} -f schema.sql
```

## 3. API documentation

### Common API Stuff

#### Supported Http Methods

| Method | Use  |
| :------: | ---- |
| GET | Fetch Data from the database |
| POST | Insert Data to the database |
| PATCH | Update data to the database |
| DELETE | Remove data from the database |

Note:
Depending the API Call some http methods may not be Supported

#### Data format
Any data send or receives will be in `JSON` format. Each http request and response, should have the following header `Content-type: application/json`.

#### HTTP Response Status Codes

| Status Code | Purpoce |
| :-----------: | ------ |
| `404 NOT FOUND` | When an Http `GET` request fetches no data |
| `405 METHOD NOT ALLOWED` | When an endpoind is called on an uknown http method |
| `403 Forbitten` | When on http basic authentication wrong credentials are used |
| `400 BAD REQUEST` | When an http request is misformatted for example wrong headers has been provided. | 
| `500 INTERNAL ERROR` | For eny other type of error |
| `200 CREATED` | When a new entry has been created |
| `202 ACCEPTED` | When an entry sucssfully been modified |
| `200 OK` | For any other non errorous http Call |

## Endpoints

### Summary of endpoints

| Endpoint | Supported methods | Purpoce | Authentication |
| -------- | :-----------------: | ------ | ------------- |
| `/weather` | `GET` | Fetches the weather from a specific city | NO |
| `/city` | `GET` | Fetches the weather oof a specific city | NO |
| `/city/favourites` | `GET`,`POST`,`DELETE` | Manages the user's favourite cities | [Basic Http Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) for all methods |

### Analytical Description of endpoints

If any missing infomation is missing bellow refer to the endpoint summary.

#### `/weather` endpoints

##### `GET` method

Fetches the weather from a specific city. This method needs the following parameters:

| Parameter Name | Type | Format | Description | Required |
| -------------- | ---- | ------ | ----------- | -------- |
| `city_id` | INTEGER | N/A | The is of a city (database pk) | YES, only when `city_name` is not provided.* |
| `city_name` | String | nameof the city, country (country can be ommited) | The name of a city and a country | YES, only when `city_id` is not provided.* |
| `from_timestamp` | DATE | `YYY-MM-DD HH:mm:ss` (as seen in [moment.js](http://momentjs.com/docs/#/parsing/string/) | User's local date and time | NO |
| `forecast_duration` | INTEGER | N/A | For how many days the forecast will be fetched | NO |

\* Not both `city_id` and `city_name` should be provided, you must provide either `city_id` or `city_name` and should not ommit them. Only one of them must be provided elsewhere an error `400` will be responed.

`Example`: Fetching the weather of Athens from `2019/12/5` to `2019/12/10`:
 1. /weather?from_timestamp=2019-12-5 12:24:05&forecast_duration=5&city_name=Athens,Greece
 2. /weather?city_id=1222&from_timestamp=2019-12-5 12:24:05&forecast_duration=5

Also requires no Authentication at all.

### `/city` Endpoint

#### `GET` method:

This method requires no authentication and fetches information regarding a city.

| Parameter Name | Type | Format | Description |
| -------------- | ---- | ------ | ----------- |
| `id` | INTEGER | N/A | The city id |
| `name` | String | cityname,country | The name and th country of a city |
| `long` | FLOAT | N/A | The city's longitiude |
| `lat` | FLOAT | N/A | The city's latitiude |

The parameters should be provided in theese sets:

* `id`
* `name`
* `name`,`long`,`lat`
* `long`,`lat`

In case of provicing a city with GPS coordinates (longitute and latitude) then the closest city with this name is searched with the requested name.

### `/city/favoutites` endpoint:
A [basic http authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) is required.

#### HTTP `GET`

Retrieves the user's favourite cities. The endpoint needs the following parameters:

| Name | Type | Description | Required |
| --- | --- | ------- | ---- |
| `page` | Unsigned Integer | Result Page (used in pagination) | NO |
| `page_size` | Unsigned Integer | The number of resulrs per page | NO |

#### HTTP `POST`

Adds a city as user's favourite. It needs a compulsory parameter named `city_id` into an `INTEGER` format.

#### HTTP `DELETE`

Removes a city that the user marks favourite before. It needs a compulsory parameter named `city_id` into an `INTEGER` format.