const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe, si está activo
    const estado = true;
    const usuario = await Usuario.findOne({ correo, estado });
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos'
      });
    }
    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos'
      });
    }
    // Generar el JWT
    const token = await generarJWT(usuario.id);
    // Respuesta
    res.json({
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Contactese con el administrador'
    });
  }
};

module.exports = {
  login
};
