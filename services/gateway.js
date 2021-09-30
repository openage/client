const crud = require('../helpers/crud')

exports.workflows = crud('gateway', 'workflows')
exports.tenants = crud('gateway', 'tenants')
exports.projects = crud('gateway', 'projects')
exports.organizations = crud('gateway', 'organizations')
exports.tasks = crud('gateway', 'tasks')
