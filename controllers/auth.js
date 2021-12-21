const bcryptjs = require('bcryptjs');

const Usuario = require('../models');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;
  try {
    const { nombre, img, correo } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      // Lo creamos en caso de que no exista
      const data = {
        nombre,
        correo,
        password: 'Aa',
        img,
        rol: 'USER_ROLE',
        google: true
      };
      usuario = new Usuario(data);
      await usuario.save();
    }
    // Si el usuario en DB está desactivado
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      });
    }
    // Genero el JWT
    const token = await generarJWT(usuario.id);
    res.json({
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'El token de Google no es válido'
    });
  }
};

module.exports = {
  login,
  googleSignIn
};
