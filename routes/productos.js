const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { productoExisteId } = require('../helpers/db-validators');

const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto
} = require('../controllers/productos');

const router = Router();

// Obtener todos los Productos - público
router.get('/', obtenerProductos);

// Obtener un Producto por id - público
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(productoExisteId),
  validarCampos
], obtenerProducto);

// Crear Producto - privado - cualquier persona con un token válido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearProducto);

// Actualizar Producto por id - privado - cualquiera con token válido
router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(productoExisteId),
  validarCampos
], actualizarProducto);

// Borrar un Producto por id - Admin
router.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(productoExisteId),
  validarCampos
], borrarProducto);

module.exports = router;
