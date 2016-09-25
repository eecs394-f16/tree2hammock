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
  db.collection(EVENTS_COLLECTION).find({}, (err, cursor) => {
    cursor.toArray((err, data)=> {
      if (!err) {
        res.status(200).send(data)
      } else {
        res.status(503)
      }
    })
  })
})

app.post('/addNewEvent', (req, res) => {
  db.collection(EVENTS_COLLECTION).insertOne(data, (err, result) => {
    if (!err) {
      res.status(200).send('Success')
    } else {
      res.status(503)
    }
  })
})
