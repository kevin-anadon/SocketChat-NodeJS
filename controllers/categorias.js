const { Categoria, Usuario } = require('../models');

const obtenerCategorias = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate('usuario', 'nombre')
      .skip(+desde)
      .limit(+limite)
  ]);
  res.status(200).json({
    total,
    categorias
  });
};

const obtenerCategoria = async (req, res) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
  // Verifico que esté habilitada
  if (!categoria.estado) {
    return res.status(401).json({
      msg: 'Categoria no habilitada'
    });
  }

  res.status(200).json(categoria);
};

const crearCategoria = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  // Verifico que no exista la categoria
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`
    });
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id
  };

  const categoria = new Categoria(data);
  // Guardo categoría en DB
  await categoria.save();

  res.status(201).json(categoria);
};

const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const nombre = req.body.nombre.toUpperCase();
  const usuario = req.body.usuario;

  // Verifico que sea una categoria habilitada
  const categoria = await Categoria.findById(id);
  if (!categoria.estado) {
    return res.status(401).json({
      msg: 'Categoria no habilitada'
    });
  }

  // Verifico que sea un nombre no existente
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`
    });
  }

  // Verfico que sea un usuario existente
  if (usuario) {
    const usuarioExistente = await Usuario.findById(usuario);
    if (!usuarioExistente) {
      return res.status(400).json({
        msg: `El usuario con id: ${usuario} no existe`
      });
    }
    if (!usuarioExistente.estado) {
      return res.status(401).json({
        msg: 'Usuario no habilitado'
      });
    }
    categoria.usuario = usuario;
  }

  categoria.nombre = nombre;
  categoria.save();
  res.status(200).json(categoria);
};

const borrarCategoria = async (req, res) => {
  const { id } = req.params;

  // Verifico que sea una categoria habilitada
  const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
  const usuarioAutenticado = req.usuario;
  res.status(200).json({
    categoria,
    usuarioAutenticado
  });
};

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria
};
