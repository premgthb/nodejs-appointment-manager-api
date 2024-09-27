const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Appointment', appointmentSchema)
