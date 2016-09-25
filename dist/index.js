'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var db = void 0;
var fakeData0 = {
  name: 'Collin',
  location: 'Lakefill',
  start_time: '2:00pm',
  end_time: '4:00pm',
  event: 'Play catch'
};
var fakeData1 = {
  name: 'Agam',
  location: 'Deering Library',
  start_time: '8:00pm',
  end_time: '10:00pm',
  event: 'Study'
};
var fakeData2 = {
  name: 'Joon',
  location: 'Ryan Field',
  start_time: '5:00pm',
  end_time: '7:00pm',
  event: 'Practice Saxophone'
};
var fakeData3 = {
  name: 'Aagam',
  location: 'Basement',
  start_time: '2:00am',
  end_time: '5:00am',
  event: 'Graduate Student Things.'
};
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

_mongodb2.default.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + (process.env.PORT || 3000));
  });
});

app.get('/', function (req, res) {
  db.collection('users').insertOne({ test: 'hi' });
  res.send('Hammock.');
});

app.get('/getuserdata', function (req, res) {
  db.collection('users').insertOne({ data: fakeData0 });
  db.collection('users').insertOne({ data: fakeData1 });
  db.collection('users').insertOne({ data: fakeData2 });
  db.collection('users').insertOne({ data: fakeData3 });
  res.send('Hammock.');
});

app.get('/getLiveData', function (req, res) {
  db.collection('users').find({}, function (err, cursor) {
    cursor.toArray(function (err, data) {
      res.send(data);
    });
  });
});