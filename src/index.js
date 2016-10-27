import express from 'express'
import bodyParser from 'body-parser'
import mongodb from 'mongodb'
import request from 'request'


let app = express()
let db
const EVENTS_COLLECTION = 'users' // Change this to events

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // Save database object from the callback for reuse.
  db = database
  console.log("Database connection ready")

  // Initialize the app.
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`)
  })
})

app.get('/', (req, res) => {
  res.send('Hammock.')
})

app.get('/getLiveEvents', (req, res) => {
  // let securityToken = req.query.securityToken
  // if (securityToken !== process.env.SECURITY_TOKEN) {
  //   res.status(401).send('Invalid Security Token')
  //   return
  // }

  db.collection(EVENTS_COLLECTION).find({}, (err, cursor) => {
    cursor.toArray((err, data) => {
      if (!err) {
        res.status(200).send(filterByActiveTime(data))
      } else {
        res.status(400)
      }
    })
  })
})

app.post('/addNewEvent', (req, res) => {
  // let securityToken = req.body.security_token
  // if (securityToken !== process.env.SECURITY_TOKEN) {
  //   res.status(401).send('Invalid Security Token')
  //   return
  // }

  let data = req.body.data
  db.collection(EVENTS_COLLECTION).insertOne({data: data}, (err, result) => {
    if (!err) {
      res.status(200).send('Success')
    } else {
      res.status(400)
    }
  })
})

app.post('/addGoing', (req, res) => {
  const event_id = mongodb.ObjectId(req.body._id);
  const name = req.body.name;

  // Find the event to which we want to add the person going
  db.collection(EVENTS_COLLECTION).find({"_id": event_id}, (err, cursor) => {
    cursor.toArray((err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        const going_list = data[0].data.going;
        // Add the new name to the list of people going
        going_list.push(name);
        // Replace the old list of people with the new one
        db.collection(EVENTS_COLLECTION).update({"_id": event_id}, {$set: {"data.going": going_list}}, (err) => {
          if (err) {
            res.status(400);
          } else {
            res.status(200).send('Success');
          }
        });
      }
    });
  });
});

app.delete('/deleteEvent', (req, res) => {
  // let securityToken = req.body.security_token
  // if (securityToken !== process.env.SECURITY_TOKEN) {
  //   res.status(401).send('Invalid Security Token')
  //   return
  // }

  let event_id = req.body._id
  let selector = {_id: mongodb.ObjectId(event_id)}

  db.collection(EVENTS_COLLECTION).remove(selector, (err, result) => {
    if (!err) {
      res.status(200).send('Success')
    } else {
      res.status(400).send('Failure')
    }
  })
})

const filterByActiveTime = (data) => {
  const len = data.length

  data = data.filter((el) => {
    return (new Date(el.data.time.end) > new Date())
  })

  return data
}