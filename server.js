require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

const { PORT = 3000, DATABASE_URL } = process.env

// middleware
//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

mongoose.connection
  .on('open', () => console.log('You are connected to mongoose'))
  .on('close', () => console.log('You are disconnected from mongoose'))
  .on('error', (error) => console.log(error))

const BookSchema = new mongoose.Schema({
  website: String,
  url: String,
})

const Book = mongoose.model('Book', BookSchema)

// ROutes

app.get('/', (req, res) => {
  res.send('bookmark')
})

app.get('/book', async (req, res) => {
  try {
    res.json(await Book.find({}))
  } catch (error) {
    res.status(400).json(error)
  }
})

// create
app.post('/book', async (req, res) => {
  try {
    res.json(await Book.create(req.body))
  } catch (error) {
    res.status(400).json(error)
  }
})

// update
app.put('/book/:id', async (req, res) => {
  try {
    res.json(
      await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    )
  } catch (error) {
    res.status(400).json(error)
  }
})

// delete

app.delete('/book/:id', async (req, res) => {
  try {
    res.json(await Book.findByIdAndRemove(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

// index
app.get('/book/:id', async (req, res) => {
  try {
    res.json(await Book.findById(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
