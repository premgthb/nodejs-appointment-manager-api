const express = require('express')
const dbConnection = require('./config/db')
const dotenv = require('dotenv').config()
const appointmentRoutes = require('./routes/appointmentRoutes')

dbConnection()
const app = express()

const port = process.env.PORT || 5000

app.use(express.json())
app.use('/api/appointments', appointmentRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
