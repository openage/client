const crud = require('../helpers/crud')

exports.akas = crud('discovery', 'akas')
exports.akatemplates = crud('discovery', 'akatemplates')
exports.profiles = crud('discovery', 'profiles')
exports.interests = crud('discovery', 'interests')
exports.categories = crud('discovery', 'categories')
exports.tenants = crud('discovery', 'tenants')
exports.users = crud('discovery', 'users')