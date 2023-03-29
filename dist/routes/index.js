"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieRoutes = exports.logRoutes = exports.authRoutes = exports.viewRoutes = exports.pluginRoutes = exports.postRoutes = exports.getRoutes = void 0;
const user_1 = __importDefault(require("../model/user"));
const bunyan_1 = __importDefault(require("bunyan"));
const validationSchema_1 = require("../validation/validationSchema");
const logUser_1 = __importDefault(require("../model/logUser"));
const getRoutes = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
            return "Hello stranger";
        }
    });
};
exports.getRoutes = getRoutes;
const postRoutes = (server) => {
    server.route({
        method: 'POST',
        path: '/',
        handler: function (request, h) {
            const user = Object.values(request.payload);
            return `Hello, ${user}`;
        }
    });
};
exports.postRoutes = postRoutes;
const pluginRoutes = (server) => __awaiter(void 0, void 0, void 0, function* () {
    server.route([
        {
            method: 'GET',
            path: '/welcome',
            handler: function (request, h) {
                // return h.file('../static/welcome.html')
                return h.response('../static/welcome.html');
                // return h.response({ relativeTo: '../static/welcome.html' })
            },
        }
    ]);
});
exports.pluginRoutes = pluginRoutes;
const viewRoutes = (server) => {
    server.route({
        method: 'GET',
        path: '/view',
        handler: {
            view: "index.html"
        }
    });
};
exports.viewRoutes = viewRoutes;
const authRoutes = (server) => {
    server.route({
        method: 'POST',
        path: '/register',
        handler: function (request, h) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("payload : ", request.payload);
                const registerError = (0, validationSchema_1.registerValidation)(request.payload);
                try {
                    if (registerError.error) {
                        const errors = [];
                        registerError.error.details.forEach(details => {
                            let error = { [details.path.toString()]: details.message };
                            errors.push(error);
                        });
                        throw errors;
                    }
                    else {
                        const newUser = new user_1.default(request.payload);
                        console.log("New user : ", newUser);
                        yield newUser.save();
                        return newUser;
                    }
                }
                catch (error) {
                    console.log("Error in catch : ", error);
                    return error;
                }
            });
        }
    });
};
exports.authRoutes = authRoutes;
const logRoutes = (server) => {
    var log = bunyan_1.default.createLogger({
        name: 'userBunyan',
        serializers: bunyan_1.default.stdSerializers
    });
    server.route({
        method: 'POST',
        path: '/log',
        handler: function (request, h) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("req user payload : ", request.payload);
                const userError = (0, validationSchema_1.userValidation)(request.payload);
                try {
                    if (userError.error) {
                        const errors = [];
                        userError.error.details.forEach(details => {
                            let error = { [details.path.toString()]: details.message };
                            errors.push(error);
                        });
                        throw errors;
                    }
                    else {
                        const newUser = new logUser_1.default(request.payload);
                        yield newUser.save();
                        return newUser;
                    }
                }
                catch (error) {
                    console.log("Error : ", error);
                    const err = new Error(error);
                    log.info({ err }, error);
                    return error;
                }
            });
        }
    });
};
exports.logRoutes = logRoutes;
const cookieRoutes = (server) => {
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
                const data = request.payload;
                if (data.account === 'pavi' && data.password === 'pavi@2000') {
                    console.log('dc', data.account);
                    return h.response('success');
                }
                else {
                    return "wrong";
                }
            }
        },
        {
            method: 'GET',
            path: '/cookie',
            handler: function (request, h) {
                console.log("req state ; ", request.state);
                const cookie = request.state.myCookie;
                console.log(cookie);
                return h.response('Hello cookie!').state('myCookie', { greeted: true });
            }
        }
    ]);
};
exports.cookieRoutes = cookieRoutes;
