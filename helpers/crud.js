// const roleHelper = require('./role-helper')
const headerHelper = require('./header-helper')
const client = new (require('node-rest-client-promise')).Client()
const buildUrl = require('build-url')

module.exports = (service, collection) => {
    const config = require('config').get('providers')[service]

    const parseResponse = (res, context) => {
        if (!res.data.isSuccess) {
            context.logger.error(res.data.message || res.data.error)
            throw new Error(res.data.message || res.data.error)
        }

        return res.data
    }

    const createArgs = (context) => {
        return {
            headers: headerHelper.build(context)
        }
    }

    const createUrl = (options, context) => {
        options = options || {}

        let url = buildUrl(config.url, {
            path: options.path ? `${collection}/${options.path}` : collection,
            queryParams: options.query
        })

        context.logger.debug(`sending payload to url: ${url}`)

        return url
    }

    const createResourceUrl = (id, options, context) => {
        options = options || {}

        let url = buildUrl(config.url, {
            path: `${collection}/${id}`,
            queryParams: options.query
        })

        context.logger.debug(`sending payload to url: ${url}`)

        return url
    }

    const post = async (model, options, context) => {
        const url = createUrl(options, context)
        const args = createArgs(context)
        args.data = model

        const response = await client.postPromise(url, args)
        return parseResponse(response, context).data
    }

    const search = async (query, options, context) => {
        let url = buildUrl(config.url, {
            path: options.path ? `${collection}/${options.path}` : collection,
            queryParams: query
        })

        const args = createArgs(context)

        let response = await client.getPromise(url, args)
        return parseResponse(response, context).items
    }

    const get = async (id, options, context) => {
        const url = createResourceUrl(id, options, context)
        const args = createArgs(context)

        let response = await client.getPromise(url, args)
        return parseResponse(response, context).data
    }

    const put = async (id, model, options, context) => {
        const url = createResourceUrl(id, options, context)
        const args = createArgs(context)
        args.data = model

        let response = await client.putPromise(url, args)
        return parseResponse(response, context).data
    }

    const remove = async (id, options, context) => {
        const url = createResourceUrl(id, options, context)
        const args = createArgs()

        let response = await client.deletePromise(url, args)
        return parseResponse(response, context).data
    }

    return {
        create: async (model, context) => {
            return post(model, {}, context)
        },
        search: async (query, context) => {
            return search(query, {}, context)
        },
        get: async (id, context) => {
            return get(id, {}, context)
        },
        update: async (id, model, context) => {
            return put(id, model, {}, context)
        },
        remove: async (id, options, context) => {
            return remove(id, options, context)
        },
        post: async (model, options, context) => {
            return post(model, options, context)
        }
    }
}
