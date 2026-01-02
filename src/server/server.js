const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// ✅ Fixed path - resolve from src/server to root
dotenv.config({ path: path.resolve(__dirname, '../../config.env') });
const app = require('./app');

if (!process.env.DATABASE) {
  console.error('DATABASE environment variable is missing. Please check config.env.');
  process.exit(1);
}
const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then((con) => console.log('MongoDB Connected'))
  .catch((err) => {
    console.log('Connection to Database Failed!');
    console.error('MongoDB Error:', err);
  });

// console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App Running on Port ${port}`);
});
