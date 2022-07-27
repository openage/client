const crud = require('../helpers/crud')

exports.integrations = crud('connect', 'integrations')
exports.providers = crud('connect', 'providers')
const lookups = crud('connect', 'lookups')

// lookups('countries').find('in')
exports.lookups = (area) => {
    return {
        find: async (code, context) => {
            let page = await lookups.search({
                area: area,
                code: code
            }, context)

            if(!page.items || !page.items.length) {
                return null
            }

            return page.items[0]
        }
    }
}
