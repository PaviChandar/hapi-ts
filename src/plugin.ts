import { ResponseToolkit, Server } from '@hapi/hapi'

const myplugin = {
    name: 'myplugin',
    version: '1.0.0',
    register: async function (server:Server) {
      server.route({
        method: 'POST',
        path: '/test',
        handler: function (request:Request, h:ResponseToolkit) {
          return h.response("My first plugin")
        }
      })
    }
  }
  
  export default myplugin