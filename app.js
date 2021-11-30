const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

require('dotenv').config();

const db = require('./utils/db');
db.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Database connected!');
  })
  .catch(console.log);

const adminRoutes = require('./routes/admin.routes');
app.use('/admin', adminRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/user', userRoutes);

module.exports = app;
