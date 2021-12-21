const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');
const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router = Router();

router.post('/', cargarArchivo);

router.put('/:coleccion/:id', [
  validarArchivo,
  check('id', 'El id debe ser de tipo MongoID').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
  check('id', 'El id debe ser de tipo MongoID').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], mostrarImagen);

module.exports = router;
