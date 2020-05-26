const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const colors = require('colors');

const { Bootcamp } = require('./models');

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '_data', 'bootcamps.json'), 'utf8')
);

const importData = async () => {
  try {
    await BootCamp.create(bootcamps);
    console.log(`Data Imported`.green.inverse);
    process.exit();
  } catch (e) {
    console.log(e.message);
  }
};

const deleteData = async () => {
  try {
    await BootCamp.deleteMany();
    console.log(`Data Destroyed`.red.inverse);
    process.exit();
  } catch (e) {
    console.log(e.message);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
