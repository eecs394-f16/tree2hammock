import express from 'express'
import bodyParser from 'body-parser'
import mongodb from 'mongodb'
import request from 'request'


let app = express()

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
  res.send('Hammock.')
})

app.get('/getuserdata', (req, res) => {
  res.send('Hammock.')
})
