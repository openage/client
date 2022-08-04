const crud = require('../helpers/crud')

exports.integrations = crud('connect', 'integrations')
exports.providers = crud('connect', 'providers')
const lookups = crud('connect', 'lookups')

// lookups('countries').find('in')
// lookups.find({name:'countries', text: 'in'}, context)
exports.lookups = (name, context) => {
    return {
        get: async (code, context) => {
            return lookups.get(`${name}/${code}`, context)
        }
    }
}
