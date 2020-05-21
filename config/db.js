const mongoose = require('mongoose');

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  console.log(
    `connected to mongoDb: ${conn.connection.host}`.bold.cyan.underline
  );
};

module.exports = connectDb;
