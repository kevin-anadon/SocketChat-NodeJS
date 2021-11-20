const Role = require('../models/role');
const Usuario = require('../models/usuario');

const validarRolPost = async (rol = '') => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la DB`);
  }
};

const validarRolPut = async (rol) => {
  if (rol) {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
      throw new Error(`El rol ${rol} no está registrado en la DB`);
    }
  }
};

const emailExiste = async (correo = '') => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo: ${correo} ya está registrado`);
  }
};

const usuarioExisteId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El usuario con id: ${id} no existe`);
  }
};

module.exports = {
  validarRolPost,
  validarRolPut,
  emailExiste,
  usuarioExisteId
};
