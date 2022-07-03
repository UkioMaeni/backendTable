const pg=require('pg')
require('dotenv').config()

const auth={
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT
}

const client= new pg.Client(auth)

client.connect(()=>{
    const query='CREATE TABLE IF NOT EXISTS datacell (id SERIAl PRIMARY KEY, time DATE ,name VARCHAR,count INTEGER,distance VARCHAR)'
    client.query(query)
})

module.exports=new pg.Client(auth)
