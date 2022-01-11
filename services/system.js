const crud = require('../helpers/crud')

exports.logs = crud('system', 'logs')
exports.organizations = crud('system', 'organizations')
exports.tasks = crud('system', 'tasks')
exports.tenants = crud('system', 'tenants')
exports.users = crud('system', 'users')
