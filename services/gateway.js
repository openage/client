const crud = require('../helpers/crud')

exports.projects = crud('gateway', 'projects')
exports.projecttypes = crud('gateway', 'projecttypes')
exports.sprints = crud('gateway', 'sprints')
exports.organizations = crud('gateway', 'organizations')
exports.tasks = crud('gateway', 'tasks')
exports.tasktemplates = crud('gateway', 'tasktemplates')
exports.tenants = crud('gateway', 'tenants')
exports.timelogs = crud('gateway', 'timelogs')
exports.users = crud('gateway', 'users')
exports.workflows = crud('gateway', 'workflows')
