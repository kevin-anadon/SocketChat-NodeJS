const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'Nombre obligatorio']
  },
  correo: {
    type: String,
    required: [true, 'Correo obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Contraseña obligatorio']
  },
  img: {
    type: String
  },
  rol: {
    type: String,
    required: [true, 'Rol obligatorio'],
    emun: ['ADMIN_ROLE', 'USER_ROLE']
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, _id, password, estado, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
