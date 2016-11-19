//Setting Up Database

/**
* Create the connection String
*
* @param string username The database user username
* @param string password The database user password
* @param string database The database name
* @param string host Where the database is hosted if empty 'localhost' assumed
* @param string | int port The port for the connection
*
* @return string
*/
var connection=function(username,password,database,host,port)
{
  if(!port)
  {
      port=5432
  }

  if(!host)
  {
    host='localhost'
  }

  return "pg://"+username+':'+password+'@'+host+':'+port+'/'+database
}


var connection_info={
  client: 'pg',
  connection: connection(
                         process.env.UMBRELAPP_DB_USER,
                         process.env.UMBRELAPP_DB_PASSWD,
                         process.env.UMBRELAPP_DB_NAME,
                         process.env.UMBRELAPP_DB_HOST,
                         process.env.UMBRELAPP_DB_PORT
                       )
};

var knex = require('knex')(connection_info);

module.exports=knex;
