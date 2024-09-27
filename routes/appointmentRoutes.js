const express = require('express')
const router = express.Router()
const { getAppointments, bookAppoinment } = require('../controller/appointmentController')
const { dataValidateChainMethod } = require('../middleware/validation')

// const validation = (req, res, next) => {}
// router.use(validation)
router.get('/:date', dataValidateChainMethod, getAppointments)
router.post('/', bookAppoinment)

module.exports = router
