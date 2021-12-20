const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
require('dotenv').config();

class Server {
  constructor () {
    this.app = express();
    this.port = process.env.PORT;
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

  listen () {
    this.app.listen(this.port, () => {
      console.log('RestServer funcionando en el puerto ', this.port);
    });
  }
}

module.exports = Server;
