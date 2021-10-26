const crud = require('../helpers/crud')

exports.files = crud('drive', 'files')
exports.filetemplates = crud('drive', 'filetemplates')
exports.folders = crud('drive', 'folders')
exports.foldertemplates = crud('drive', 'foldertemplates')
exports.tenants = crud('drive', 'tenants')
exports.organizations = crud('drive', 'organizations')
exports.users = crud('drive', 'users')

