const crud = require('../helpers/crud')

exports.carriers = crud('re', 'carriers')
exports.commoditytypes = crud('re', 'commoditytypes')
exports.imos = crud('re', 'imos')
exports.incoterms = crud('re', 'incoterms')
exports.organizations = crud('re', 'organizations')
exports.ports = crud('re', 'ports')
exports.raterequests = crud('re', 'raterequests')
exports.rates = crud('re', 'rates')
exports.schedules = crud('re', 'schedules')
exports.services = crud('re', 'services')
exports.supplierservices = crud('re', 'supplierservices')
exports.tasks = crud('re', 'tasks')
exports.tenants = crud('re', 'tenants')
exports.unnumbers = crud('re', 'unnumbers')
exports.users = crud('re', 'users')
