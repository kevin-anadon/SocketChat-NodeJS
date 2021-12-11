const { ObjectId } = require('mongoose').Types;
const { Categoria, Producto, Usuario } = require('../models');

const coleccionesPermitidas = [
  'categorias',
  'productos',
  'roles',
  'usuarios'
];

const buscarCategorias = async (termino = '', res) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    const categoria = await Usuario.findById(termino);
    return res.json({
      results: (categoria) ? [categoria] : []
    });
  }

  termino = new RegExp(termino, 'i');
  const [total, categorias] = await Promise.all([
    Categoria.count({ nombre: termino }),
    Categoria.find({ nombre: termino })
  ]);
  return res.json({
    count: total,
    results: categorias
  });
};

const buscarProductos = async (termino = '', res) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    const producto = await Usuario.findById(termino);
    return res.json({
      results: (producto) ? [producto] : []
    });
  }

  termino = new RegExp(termino, 'i');
  const [total, productos] = await Promise.all([
    Producto.count({ nombre: termino }),
    Producto.find({ nombre: termino })
  ]);
  return res.json({
    count: total,
    results: productos
  });
};

const buscarUsuarios = async (termino = '', res) => {
  const esMongoId = ObjectId.isValid(termino);

  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: (usuario) ? [usuario] : []
    });
  }
  termino = new RegExp(termino, 'i');
  const [total, usuarios] = await Promise.all([
    Usuario.count({
      $or: [{ nombre: termino }, { correo: termino }],
      $and: [{ estado: true }]
    }),
    Usuario.find({
      $or: [{ nombre: termino }, { correo: termino }],
      $and: [{ estado: true }]
    })
  ]
  );

  return res.json({
    count: total,
    results: usuarios
  });
};

const buscar = (req, res) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
    });
  }

  switch (coleccion) {
    case 'categorias':
      buscarCategorias(termino, res);
      break;
    case 'productos':
      buscarProductos(termino, res);
      break;
    case 'usuarios':
      buscarUsuarios(termino, res);
      break;
    default:
      res.status(500).json({
        msg: 'Opción no implementada'
      });
  }
};

module.exports = {
  buscar
};
