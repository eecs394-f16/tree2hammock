import express from 'express'
import bodyParser from 'body-parser'
import mongodb from 'mongodb'
import request from 'request'


let app = express()
let db
let fakeData0 = {
  name: 'Collin',
  location: 'Lakefill',
  start_time: '2:00pm',
  end_time: '4:00pm',
  event: 'Play catch'
}
let fakeData1 = {
  name: 'Agam',
  location: 'Deering Library',
  start_time: '8:00pm',
  end_time: '10:00pm',
  event: 'Study'
}
let fakeData2 = {
  name: 'Joon',
  location: 'Ryan Field',
  start_time: '5:00pm',
  end_time: '7:00pm',
  event: 'Practice Saxophone'
}
let fakeData3 = {
  name: 'Aagam',
  location: 'Basement',
  start_time: '2:00am',
  end_time: '5:00am',
  event: 'Graduate Student Things.'
}
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

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
  db.collection('users').insertOne({test:'hi'})
  res.send('Hammock.')
})

app.get('/getuserdata', (req, res) => {
  db.collection('users').insertOne({data:fakeData0})
  db.collection('users').insertOne({data:fakeData1})
  db.collection('users').insertOne({data:fakeData2})
  db.collection('users').insertOne({data:fakeData3})
  res.send('Hammock.')
})

app.get('/getLiveData', (req, res) => {
  db.collection('users').find({}, (err, cursor) => {
    cursor.toArray((err, data)=> {
      res.send(data)
    })
  })
})
