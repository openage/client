const crud = require('../helpers/crud')

exports.sessions = crud('directory', 'sessions')
exports.getSessionById = this.sessions.get

exports.users = crud('directory', 'users')
exports.auth = {
    signIn: async (email, code, mobile, password, context) => {
        return this.users.post({
            purpose: 'login',
            user: {
                email: email,
                code: code,
                mobile: mobile,
                password: password
            }
        }, {
            path: 'signIn'
        }, context)
    }
}

exports.roles = crud('directory', 'roles')
exports.getRole = this.roles.get
exports.getRoleById = this.roles.get

exports.employees = crud('directory', 'employees')
exports.organizations = crud('directory', 'organizations')
exports.tenants = crud('directory', 'tenants')
