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
        let serviceUrl

        if (context) {
            let service
            if (context.services && context.services.get) {
                service = context.services.get(serviceCode)
            }
            if (!service && context.organization && context.organization.services && context.organization.services.length) {
                service = context.organization.services.find(s => s.code === serviceCode)
            }

            if (!service && context.tenant && context.tenant.services && context.tenant.services.length) {
                service = context.tenant.services.find(s => s.code === serviceCode)
            }

            if (service) {
                serviceUrl = service.url
            }
        }

        if (!serviceUrl) {
            const config = require('config').get('providers')[serviceCode] || {}
            serviceUrl = config.url
        }

        if (!serviceUrl) {
            throw new Error(`Could not find root URL for service: ${serviceCode}`)
        }
    }

    const getCollectionUrl = (options, context) => {
        options = options || {}
        const rootUrl = getServiceUrl(context)
        let url = buildUrl(rootUrl, {
            path: options.path ? `${collection}/${options.path}` : collection,
            queryParams: options.query
        })

        context.logger.debug(`sending payload to url: ${url}`)

        return url
    }

    const getResourceUrl = (id, options, context) => {
        options = options || {}

        let url = buildUrl(getServiceUrl(context), {
            path: `${collection}/${id}`,
            queryParams: options.query
        })

        context.logger.debug(`sending payload to url: ${url}`)

        return url
    }

    const post = async (model, options, context) => {
        const response = await axios({
            method: "post",
            url: getCollectionUrl(options, context),
            data: model,
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).data
    }

    const upload = async (file, options, context) => {
        const headers = headerHelper.build(context)
        headers['Content-Type'] = 'multipart/form-data'

        const FormData = require('form-data')
        const fs = require('fs')
        const form = new FormData()
        form.append('file', fs.createReadStream(file.path))

        const response = await axios({
            method: "post",
            url: getCollectionUrl(options, context),
            data: form,
            headers: headers
        })
        return parseResponse(response, context).data
    }

    const search = async (query, options, context) => {

        options = options || {}
        options.query = query || options.query

        let response = await axios({
            method: 'get',
            url: getCollectionUrl(options, context),
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).items
    }

    const get = async (id, options, context) => {
        let response = await axios({
            method: 'get',
            url: getResourceUrl(id, options, context),
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).data
    }

    const put = async (id, model, options, context) => {
        let response = await axios({
            method: 'put',
            url: getResourceUrl(id, options, context),
            data: model,
            headers: headerHelper.build(context)
        })
        return parseResponse(response, context).data
    }

    const remove = async (id, options, context) => {
        let response = await axios({
            method: 'delete',
            url: getResourceUrl(id, options, context),
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
        },
        upload: async (file, options, context) => {
            return upload(file, options, context)
        }
    }
}