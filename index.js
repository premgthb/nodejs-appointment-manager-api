const express = require('express')
const connectDb = require('./config/db')
// const errorHandler = require('./middleware/errorHandler')
const dbConnection = require('./config/db')
const dotenv = require('dotenv').config()

dbConnection()
const app = express()

const port = process.env.PORT || 5000

app.use(express.json())
app.use('/api/appointments', require('./routes/appointmentRoutes'))
// app.use('/api/users', require('./routes/userRoutes'))
// app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
