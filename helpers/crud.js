const headerHelper = require('./header-helper')
const buildUrl = require('build-url')
const axios = require('axios')

module.exports = (serviceCode, collection) => {
    const parseResponse = (res, context) => {
        if (!res.data.isSuccess) {
            context.logger.error(res.data.message || res.data.error)
            throw new Error(res.data.message || res.data.error)
        }

        return res.data
    }

    const getServiceUrl = (context) => {
        let service

        if (context) {
            if (context.services && context.services.get) {
                service = context.services.get(serviceCode)
            }
            if (!service && context.organization && context.organization.services && context.organization.services.length) {
                service = context.organization.services.find(s => s.code === serviceCode)
            }

            if (!service && context.tenant && context.tenant.services && context.tenant.services.length) {
                service = context.tenant.services.find(s => s.code === serviceCode)
            }
        }

        if (!service) {
            service = require('config').get('providers')[serviceCode]
        }

        if (!service) {
            context.logger.error(`Could not find root URL for service: ${serviceCode}`)
            return
        }

        return service.url
    }

    const getCollectionUrl = (options, context) => {
        const rootUrl = getServiceUrl(context)
        if (!rootUrl) {
            return
        }
        options = options || {}

        let url = buildUrl(rootUrl, {
            path: options.path ? `${collection}/${options.path}` : collection,
            queryParams: options.query
        })

        context.logger.debug(`sending payload to url: ${url}`)

        return url
    }

    const getResourceUrl = (id, options, context) => {

        const rootUrl = getServiceUrl(context)
        if (!rootUrl) {
            return
        }
        options = options || {}

        let url = buildUrl(rootUrl, {
            path: `${collection}/${id}`,
            queryParams: options.query
        })

        context.logger.debug(`sending payload to url: ${url}`)

        return url
    }

    const post = async (model, options, context) => {
        let url = getCollectionUrl(options, context)

        if (!url) {
            return {}
        }

        const response = await axios({
            method: "post",
            url: url,
            data: model,
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).data
    }

    const upload = async (file, options, context) => {

        let url = getCollectionUrl(options, context)

        if (!url) {
            return {}
        }

        let headers = headerHelper.build(context)
        headers['Content-Type'] = 'multipart/form-data'

        const FormData = require('form-data')
        const fs = require('fs')
        const form = new FormData()
        form.append('file', fs.createReadStream(file.path))
        headers = { ...headers, ...form.getHeaders() }

        const response = await axios({
            method: "post",
            url: url,
            data: form,
            headers: headers
        })
        return parseResponse(response, context).data
    }

    const search = async (query, options, context) => {
        let url = getCollectionUrl(options, context)

        if (!url) {
            return {}
        }

        options = options || {}
        options.query = query || options.query

        let response = await axios({
            method: 'get',
            url: url,
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).items
    }

    const get = async (id, options, context) => {
        let url = getResourceUrl(id, options, context)

        if (!url) {
            return {}
        }

        let response = await axios({
            method: 'get',
            url: url,
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).data
    }

    const put = async (id, model, options, context) => {
        let url = getResourceUrl(id, options, context)

        if (!url) {
            return {}
        }
        let response = await axios({
            method: 'put',
            url: url,
            data: model,
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).data
    }

    const remove = async (id, options, context) => {
        let url = getResourceUrl(id, options, context)

        if (!url) {
            return {}
        }

        let response = await axios({
            method: 'delete',
            url: url,
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).data
    }

    return {
        create: async (model, context) => {
            return post(model, {}, context)
        },
        search: async (query, context) => {
            return search(query, {}, context)
        },
        get: async (id, param1, param2) => {
            let options = {}
            let context = {}

            if (param2) {
                options = param1
                context = param2
            } else {
                context = param1
            }

            return get(id, options, context)
        },
        update: async (id, model, context) => {
            return put(id, model, {}, context)
        },
        remove: async (id, options, context) => {
            return remove(id, options, context)
        },
        post: async (model, options, context) => {
            return post(model, options, context)
        },
        upload: async (file, options, context) => {
            return upload(file, options, context)
        }
    }
}