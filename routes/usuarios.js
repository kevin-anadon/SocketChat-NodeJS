const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarRolPost, validarRolPut, emailExiste, usuarioExisteId } = require('../helpers/db-validators');
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete
} = require('../controllers/usuarios');

const router = Router();

router.get('/', [
  // check('limit')
], usuariosGet);

router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(usuarioExisteId),
  check('rol').custom(validarRolPut),
  validarCampos
], usuariosPut);

router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'La contraseña debe tener más de 6 caractéres').isLength({ min: 6 }),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom(emailExiste),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom(validarRolPost),
  validarCampos
], usuariosPost);

router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(usuarioExisteId),
  validarCampos
], usuariosDelete);

module.exports = router;
