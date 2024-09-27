const { param } = require('express-validator')

const dataValidateChainMethod = [param('date').isDate({ format: 'YYYY-MM-DD' })]

module.exports = { dataValidateChainMethod }
