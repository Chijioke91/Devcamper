const express = require('express');
const dotenv = require('dotenv');

dotenv.config({
  path: './config/config.env',
});

const { bootcamps } = require('./routes');

const port = process.env.PORT;

const app = express();

// routes
app.use('/api/v1/bootcamps', bootcamps);

app.listen(
  port,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${port}`
  )
);
