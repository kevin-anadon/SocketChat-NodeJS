const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');
require('dotenv').config();

class Server {
  constructor () {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = require('socket.io')(this.server);
    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
      uploads: '/api/uploads'
    };
    // Conectar a base de datos
    this.conectarDB();
    // Middlewares
    this.middlewares();
    // Ruutas de mi app
    this.routes();
    // Sockets
    this.sockets();
  }

  async conectarDB () {
    await dbConnection();
  }

  middlewares () {
    // Cors
    this.app.use(cors());
    // Lectura y Parseo del body
    this.app.use(express.json());
    // Directorio Público
    this.app.use(express.static('public'));
    // Carga de archivos - Fileupload
    this.app.use(fileUpload({
      createParentPath: true,
      tempFileDir: '/tmp/',
      useTempFiles: true
    }));
  }

  routes () {
    // Llamo a las rutas
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    this.app.use(this.paths.uploads, require('../routes/uploads'));
  }

  sockets () {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen () {
    this.server.listen(this.port, () => {
      console.log('SocketChat funcionando en el puerto ', this.port);
    });
  }
}

module.exports = Server;
