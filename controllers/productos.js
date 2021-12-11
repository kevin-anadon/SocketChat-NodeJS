const { Producto, Categoria } = require('../models');

const obtenerProductos = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre')
      .skip(+desde)
      .limit(+limite)
  ]);
  res.status(200).json({
    total,
    productos
  });
};

const obtenerProducto = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre');

  // Verifico que esté habilitado
  if (!producto.estado) {
    return res.status(401).json({
      msg: 'Producto no habilitado'
    });
  }

  res.status(200).json(producto);
};

const crearProducto = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();
  const { precio, categoria, descripcion, disponible } = req.body;

  // Verifico que no exista el Producto
  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`
    });
  }

  // Generar la data a guardar
  const data = {
    categoria,
    descripcion,
    disponible,
    nombre,
    precio,
    usuario: req.usuario._id
  };

  const producto = new Producto(data);

  // Guardo producto en DB
  await producto.save();

  res.status(201).json(producto);
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { _id, estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  // Verifico que sea un nombre no existente
  const productoDB = await Producto.findOne({ nombre: data.nombre });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`
    });
  }

  // Verfico que sea una categoria existente
  if (data.categoria) {
    const categoriaExistente = await Categoria.findById(data.categoria);
    if (!categoriaExistente) {
      return res.status(400).json({
        msg: `La categoria con id: ${data.categoria} no existe`
      });
    }
    if (!categoriaExistente.estado) {
      return res.status(401).json({
        msg: 'Categoria no habilitada'
      });
    }
  }

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json(producto);
};

const borrarProducto = async (req, res) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre');
  const usuarioAutenticado = req.usuario;
  res.status(200).json({
    producto,
    usuarioAutenticado
  });
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto
};
