const { encriptar } = require('../helpers');
const Usuario = require('../models/usuario');

const usuariosGet = async (req, res) => {
  // const { nombre = 'No name', apellido, edad, page = '1', limit } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(+desde)
      .limit(+limite)
  ]);
  res.json({
    total,
    usuarios
  });
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });
  usuario.password = encriptar(password);
  // Guardar en DB
  await usuario.save();
  res.json(usuario);
};
const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;
  // TODO: Validar contra base de datos
  if (password) {
    resto.password = encriptar(password);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json(usuario);
};

const usuariosDelete = async (req, res) => {
  const { id } = req.params;
  const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAutenticado = req.usuario;
  res.json({ usuarioEliminado, usuarioAutenticado });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete
};
