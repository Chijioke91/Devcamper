const path = require('path');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
const errorHandler = require('./middleware/error');

// LOAD ENV VARS
dotenv.config({ path: './config/config.env' });

const { bootcamps, courses, auth, users, reviews } = require('./routes');

connectDb();

const port = process.env.PORT;

const app = express();

// body parser
app.use(express.json());

// add cookie parser
app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file upload
app.use(fileUpload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// error handler
app.use(errorHandler);

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
