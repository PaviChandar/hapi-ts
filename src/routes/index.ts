import { Request, ResponseToolkit, Server } from "@hapi/hapi";
import User, { IUser } from "../model/user"
import bunyan from "bunyan"
import { registerValidation, userValidation } from "../validation/validationSchema";
import LogUser, { ILogUser } from "../model/logUser";

export const getRoutes = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
            return "Hello stranger"
        }
    })
}

export const postRoutes = (server: Server) => {
    server.route({
        method: 'POST',
        path: '/',
        handler: function (request, h) {
            const user = Object.values(request.payload)
            return `Hello, ${user}`
        }
    })
}

export const pluginRoutes = async (server: Server) => {
    server.route([
        {
            method: 'GET',
            path: '/welcome',
            handler: function (request: Request, h: ResponseToolkit) {
                // return h.file('../static/welcome.html')
                return h.response('../static/welcome.html')
                // return h.response({ relativeTo: '../static/welcome.html' })
            },
        }
    ])
}

export const viewRoutes = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/view',
        handler: {
            view: "index.html"
        }
    })
}

export const authRoutes = (server: Server) => {
    server.route({
        method: 'POST',
        path: '/register',
        handler: async function (request, h) {
            console.log("payload : ", request.payload)
            const registerError = registerValidation(request.payload)
            try {
                if (registerError.error) {
                    const errors: any = []
                    registerError.error.details.forEach(details => {
                        let error = { [details.path.toString()]: details.message }
                        errors.push(error)
                    })
                    throw errors
                } else {
                    const newUser: IUser = new User(request.payload)
                    console.log("New user : ", newUser)
                    await newUser.save()
                    return newUser
                }
            } catch (error) {
                console.log("Error in catch : ", error)
                return error
            }
        }
    })
}

export const logRoutes = (server: Server) => {

    var log = bunyan.createLogger({
        name: 'userBunyan',
        serializers: bunyan.stdSerializers
    })

    server.route({
        method: 'POST',
        path: '/log',
        handler: async function (request, h) {
            console.log("req user payload : ", request.payload)
            const userError = userValidation(request.payload)
            try {
                if (userError.error) {
                    const errors: any = []
                    userError.error.details.forEach(details => {
                        let error = { [details.path.toString()]: details.message }
                        errors.push(error)
                    })

                    throw errors
                } else {
                    const newUser: ILogUser = new LogUser(request.payload)
                    await newUser.save()
                    return newUser
                }
            } catch (error: any) {
                console.log("Error : ", error)
                const err = new Error(error)
                log.info({ err }, error)
                return error
            }
        }
    })
}

export const cookieRoutes = (server: Server) => {

    server.state('myCookie', {
        ttl: null,
        isSecure: true,
        isHttpOnly: true,
        encoding: 'base64json',
        clearInvalid: false
    });

    server.route([
        {
            method: 'POST',
            path: '/cookie',
            handler: function (request, h) {
                const data: any = request.payload;
                if (data.account === 'pavi' && data.password === 'pavi@2000') {
                    console.log('dc', data.account)
                    return h.response('success')
                } else {
                    return "wrong";
                }

            }
        },
        {
            method: 'GET',
            path: '/cookie',
            handler: function (request, h) {
                console.log("req state ; ", request.state)
                const cookie = request.state.myCookie;
                console.log(cookie)
                return h.response('Hello cookie!').state('myCookie', { greeted: true });
            }
        }]
    )
}