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
const hapi_1 = require("@hapi/hapi");
const plugin_1 = __importDefault(require("./plugin"));
const index_1 = require("./routes/index");
// import Inert from "inert"
// import Vision from "vision"
// import Handlebars from 'handlebars'
require("./database");
const Inert = require('inert');
const Vision = require('vision');
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = new hapi_1.Server({
        port: 3000,
        host: 'localhost'
    });
    // const plugins: Array<Hapi.ServerRegisterPluginObject<void, void>> = [
    //     {
    //       plugin: inert
    //     },
    //     {
    //       plugin: vision
    //     },
    //   ];
    yield server.register([
        {
            plugin: plugin_1.default
        },
        {
            plugin: Inert
        },
        {
            plugin: Vision
        }
    ]);
    // server.views({
    //     engines: {
    //         html: Handlebars
    //     },
    //     path: './src/views'
    // })
    server.ext('onRequest', (request, h) => {
        if (request.headers && request.headers['postman-token']) {
            console.log("Request headers in onRequest method : ", request.headers['postman-token']);
        }
        return h.continue;
    });
    server.ext('onPreAuth', (request, h) => {
        console.log("onPreAuth functionality");
        return h.continue;
    });
    server.ext('onCredentials', (request, h) => {
        console.log("onCredentials functionality");
        return h.continue;
    });
    server.ext('onPostAuth', (request, h, error) => {
        if (request.payload) {
            console.log("onPostAuth payload : ", request.payload);
        }
        return h.continue;
    });
    server.ext('onPreHandler', (request, h) => {
        console.log("onPreHandler : before entering handler function");
        return h.continue;
    });
    server.ext('onPostHandler', (request, h) => {
        console.log("onPostHandler : after finishing handler function");
        return h.continue;
    });
    server.ext('onPreResponse', (request, h) => {
        console.log("Req res in pre-response : ", request.response.source);
        return h.continue;
    });
    (0, index_1.getRoutes)(server);
    (0, index_1.postRoutes)(server);
    (0, index_1.authRoutes)(server);
    (0, index_1.logRoutes)(server);
    (0, index_1.pluginRoutes)(server);
    (0, index_1.cookieRoutes)(server);
    yield server.start();
    console.log(`Server running on ${server.info.uri}`);
});
process.on('unhandledrejection', (error) => {
    console.log("Error in rejection : ", error);
    process.exit(1);
});
init();
