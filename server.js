const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/db');

// LOAD ENV VARS
dotenv.config({ path: './config/config.env' });

const { bootcamps } = require('./routes');

connectDb();

const port = process.env.PORT;

const app = express();

// body parser
app.use(express.json());

// morgan middleware
app.use(morgan('dev'));

// routes
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(
  port,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
      .bold
  )
);

// handle unhandled promise rejections globally
process.on('unhandledRejection', (e, promise) => {
  console.log(`Error: ${e.message}`.red.bold);

  // close server and exit on error
  server.close(() => process.exit(1));
});
