const crud = require('../helpers/crud')

exports.akas = crud('discovery', 'akas')
exports.akatemplates = crud('discovery', 'akatemplates')
exports.tenants = crud('discovery', 'tenants')
exports.users = crud('discovery', 'users')