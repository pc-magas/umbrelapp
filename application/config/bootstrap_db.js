//Setting Up Database
var knex = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.UMBRELAPP_DB_HOST,
    user : process.env.UMBRELAPP_DB_USER,
    password : process.env.UMBRELAPP_DB_PASSWD,
    database : process.env.UMBRELAPP_DB_NAME
  }
});


module.exports=knex;
