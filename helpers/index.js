const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
const encrypt = require('./encrypt');

module.exports = {
  ...dbValidators,
  ...generarJWT,
  ...googleVerify,
  ...subirArchivo,
  ...encrypt
};
