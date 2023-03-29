import { Server, Plugin } from '@hapi/hapi';
import myplugin from './plugin'
import { authRoutes, getRoutes, logRoutes, postRoutes, pluginRoutes, cookieRoutes } from './routes/index';
// import Inert from "inert"
// import Vision from "vision"
// import Handlebars from 'handlebars'
import "./database"

const Inert = require('inert')
const Vision = require('vision')

const init = async () => {
    const server: Server = new Server({
        port: 3000,
        host: 'localhost'
    })

    // const plugins: Array<Hapi.ServerRegisterPluginObject<void, void>> = [
    //     {
    //       plugin: inert
    //     },
    //     {
    //       plugin: vision
    //     },
    //   ];

    await server.register([
        {
            plugin: myplugin
        },
        {
            plugin: Inert
        },
        {
            plugin: Vision
        }
    ])

    // server.views({
    //     engines: {
    //         html: Handlebars
    //     },
    //     path: './src/views'
    // })

    server.ext('onRequest', (request, h) => {
        if (request.headers && request.headers['postman-token']) {
            console.log("Request headers in onRequest method : ", request.headers['postman-token'])
        }
        return h.continue
    })

    server.ext('onPreAuth', (request, h) => {
        console.log("onPreAuth functionality")
        return h.continue
    })

    server.ext('onCredentials', (request, h) => {
        console.log("onCredentials functionality")
        return h.continue
    })

    server.ext('onPostAuth', (request, h, error) => {
        if (request.payload) {
            console.log("onPostAuth payload : ", request.payload)
        }
        return h.continue
    })

    server.ext('onPreHandler', (request, h) => {
        console.log("onPreHandler : before entering handler function")
        return h.continue
    })

    server.ext('onPostHandler', (request, h) => {
        console.log("onPostHandler : after finishing handler function")
        return h.continue
    })

    server.ext('onPreResponse', (request: any, h) => {
        console.log("Req res in pre-response : ", request.response.source)
        return h.continue
    })

    getRoutes(server);
    postRoutes(server)
    authRoutes(server)
    logRoutes(server)
    pluginRoutes(server)
    cookieRoutes(server)

    await server.start()
    console.log(`Server running on ${server.info.uri}`)
}

process.on('unhandledrejection', (error) => {
    console.log("Error in rejection : ", error)
    process.exit(1)
})

init();