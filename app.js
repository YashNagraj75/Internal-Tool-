// app.js
const express = require('express');
const bodyParser = require('body-parser');
const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGDATABASE = decodeURIComponent(PGDATABASE);

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/db.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const {ID,chunks,page_number,topic,topic_id,unit_no} = req.body;

    console.log('Received data:', { ID,chunks,page_number,topic,topic_id,unit_no});
    // Insert data into PostgreSQL
    await sql`
      INSERT INTO data (id, chunks, page_number, topic, topic_id, unit_no)
      VALUES (${ID}, ${chunks},${page_number},${topic},${topic_id}, ${unit_no})
    `;

    console.log('Data inserted successfully!');
    res.send('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
