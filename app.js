const express = require('express');
const userRoute = require('./api/routes/users');
const morgan = require('./node_modules/morgan');
const bodyParser = require('./node_modules/body-parser');
const multer = require('./node_modules/multer');
const mongoose = require('./node_modules/mongoose');

const app = express();
const formData = multer();


mongoose.connect('mongodb://akif:785612@users-shard-00-00-t1v6g.mongodb.net:27017,users-shard-00-01-t1v6g.mongodb.net:27017,users-shard-00-02-t1v6g.mongodb.net:27017/test?ssl=true&replicaSet=users-shard-0&authSource=admin&retryWrites=true',
  { useNewUrlParser: true }).then(() => console.log('Connected to the Server!!')).catch(err => console.log(err));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
  }
  next();
});

app.use(formData.array());
app.use('/users', userRoute);

app.use('/', (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next();
});

app.use('/', (req, res) => {
  res.status(500).json({
    error: {
      message: 'error',
      Error: 'error occured',
    },
  });
});

module.exports = app;
