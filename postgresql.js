"use strict";
const { Client } = require('pg');
const express = require('express');
const app = express();
app.use(express.static("public"));
app.use(express.json());
const PORT = 8000;
app.listen(PORT);

const clientConfig = {
  user: 'postgres',       
  password: 'mypacepostgresql',    
  host: 'my-pace-postgresq.chaecyay0cqq.us-east-2.rds.amazonaws.com',        
  port: 5432,                   
  ssl: {
    rejectUnauthorized: false,  
  }
};

app.get('/country', async function (req, res) {
  const code = req.query['code'];
  const client = new Client(clientConfig);
  await client.connect(); 
  const result = await client.query("SELECT NAME FROM COUNTRY WHERE CODE=$1::text", [code]);
  
  if (result.rowCount < 1) {
    res.status(404).send("Internal Error - No Country Found");
  } else {
    res.set("Content-Type", "application/json");
    res.send(result.rows[0]);
  }
  
  await client.end();
});

app.post('/country', async function (req, res) {
  const { code, name } = req.body;
  const client = new Client(clientConfig);
  
  await client.connect();
  try {
    const result = await client.query("INSERT INTO country(code, name) VALUES($1, $2)", [code, name]);
    res.status(201).send({ message: 'Country added successfully' });
  } catch (err) {
    res.status(500).send('Error inserting country');
  }
  
  await client.end();
});

app.delete('/country', async function (req, res) {
  const code = req.query['code'];
  const client = new Client(clientConfig);
  
  await client.connect();
  try {
    const result = await client.query("DELETE FROM country WHERE code=$1", [code]);
    if (result.rowCount === 0) {
      res.status(404).send('Country not found');
    } else {
      res.status(200).send({ message: 'Country deleted successfully' });
    }
  } catch (err) {
    res.status(500).send('Error deleting country');
  }
  
  await client.end();
});# web-server-code
