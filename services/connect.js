const crud = require('../helpers/crud')

exports.integrations = crud('connect', 'integrations')
exports.providers = crud('connect', 'providers')
