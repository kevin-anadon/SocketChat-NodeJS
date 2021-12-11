const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { categoriaExisteId } = require('../helpers/db-validators');

const {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria
} = require('../controllers/categorias');

const router = Router();

// Obtener todas las categorias - público
router.get('/', obtenerCategorias);

// Obtener una categoria por id - público
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(categoriaExisteId),
  validarCampos
], obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria);

// Actualizar categoria por id - privado - cualquiera con token válido
router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(categoriaExisteId),
  check('nombre', 'Debe ingresar el nombre a actualizar').not().isEmpty(),
  validarCampos
], actualizarCategoria);

// Borrar una categoria por id - Admin
router.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(categoriaExisteId),
  validarCampos
], borrarCategoria);

module.exports = router;
