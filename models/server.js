const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
require('dotenv').config();

class Server {
  constructor () {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosRoutePath = '/api/usuarios';
    this.authPath = '/api/auth';
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
  }

  routes () {
    // Llamo a las rutas
    this.app.use(this.authPath, require('../routes/auth'));
    this.app.use(this.usuariosRoutePath, require('../routes/usuarios'));
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log('RestServer funcionando en el puerto ', this.port);
    });
  }
}

module.exports = Server;
