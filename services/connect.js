const crud = require('../helpers/crud')

exports.integrations = crud('connect', 'integrations')
exports.providers = crud('connect', 'providers')
exports.lookups = crud('connect', 'lookups')
