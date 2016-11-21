#Umbrelapp Backend
Umbrerall is a demo application that allows you to get information about the current weather situation.

## Requirements
* Postgresql:
    * On Debian/Ubuntu Gnu/Linux distributions just type:

```
sudo apt-get install postgresql
```

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
