const asyncHandler = require('express-async-handler')
const Appointment = require('../models/appointmentModel')
const moment = require('moment')
const weekdays = require('../constants')
const { validationResult } = require('express-validator')

const generateSlots = date => {
  const slots = []
  const startTime = moment(date).set({ hour: 9, minute: 0 })
  const endTime = moment(date).set({ hour: 17, minute: 0 })

  while (startTime.isBefore(endTime)) {
    const endSlot = moment(startTime).add(30, 'minutes')
    slots.push({
      start_time: startTime.format('HH:mm'),
      end_time: endSlot.format('HH:mm'),
      available_slots: 1,
    })
    startTime.add(30, 'minutes')
  }
  return slots
}

const getAvailableSLots = async date => {
  let slots = generateSlots(date)
  //   find existing appointment slots
  const bookedSlots = await Appointment.find({ date })

  let availableSlots = []

  // check for slot time clashes
  for (const slot of slots) {
    if (bookedSlots.some(bs => bs.start_time == slot.start_time && bs.end_time == slot.end_time)) {
      availableSlots.push({ ...slot, available_slots: 0 })
    } else {
      availableSlots.push(slot)
    }
  }

  return availableSlots
}

const getAppointments = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      })
    }

    const date = req.params.date

    const day_of_week = moment(date).day()

    if (!weekdays.includes(day_of_week)) {
      res.status(400).json({ message: 'Appointment slots unavailable on the weekend.' })
    }

    const slots = await getAvailableSLots(date)

    res.status(200).json(slots)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

const bookAppoinment = asyncHandler(async (req, res) => {
  const { date, start_time, end_time } = req.body

  const validateTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

  const valid =
    moment(date).isValid() && validateTimeRegex.test(start_time) && validateTimeRegex.test(end_time)

  if (!valid) {
    res.status(422).json({ message: 'date and time must be in valid formats' })
  }

  // find existing appointment
  const appointmentExists = await Appointment.findOne({ date, start_time, end_time })

  if (appointmentExists) {
    return res.status(400).json({ message: 'Appointment slot has been taken.' })
  }

  // create appointment
  const appointment = await Appointment.create(req.body)

  res.status(200).json({ message: 'Appointment slot booked successfully.', appointment })
})

module.exports = {
  getAppointments,
  bookAppoinment,
}
