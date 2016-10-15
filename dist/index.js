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
var EVENTS_COLLECTION = 'users'; // Change this to events

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
  res.send('Hammock.');
});

app.get('/getLiveEvents', function (req, res) {
  // let securityToken = req.query.securityToken
  // if (securityToken !== process.env.SECURITY_TOKEN) {
  //   res.status(401).send('Invalid Security Token')
  //   return
  // }

  db.collection(EVENTS_COLLECTION).find({}, function (err, cursor) {
    cursor.toArray(function (err, data) {
      if (!err) {
        res.status(200).send(filterByActiveTime(data));
      } else {
        res.status(400);
      }
    });
  });
});

app.post('/addNewEvent', function (req, res) {
  // let securityToken = req.body.security_token
  // if (securityToken !== process.env.SECURITY_TOKEN) {
  //   res.status(401).send('Invalid Security Token')
  //   return
  // }

  var data = req.body.data;
  console.log(data);
  db.collection(EVENTS_COLLECTION).insertOne({ data: data }, function (err, result) {
    if (!err) {
      res.status(200).send('Success');
    } else {
      res.status(400);
    }
  });
});

app.delete('/deleteEvent', function (req, res) {
  // let securityToken = req.body.security_token
  // if (securityToken !== process.env.SECURITY_TOKEN) {
  //   res.status(401).send('Invalid Security Token')
  //   return
  // }

  var event_id = req.body._id;
  var selector = { _id: _mongodb2.default.ObjectId(event_id) };

  db.collection(EVENTS_COLLECTION).remove(selector, function (err, result) {
    if (!err) {
      res.status(200).send('Success');
    } else {
      res.status(400).send('Failure');
    }
  });
});

var filterByActiveTime = function filterByActiveTime(data) {
  var len = data.length;
  console.log(data);
  for (var i = 0; i < len; i++) {
    if (new Date(data[i].data.time.end) < new Date()) {
      data.splice(i, 1);
    }
  }
  console.log(data);
  return data;
};