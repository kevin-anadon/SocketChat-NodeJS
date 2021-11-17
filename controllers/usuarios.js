const usuariosGet = (req, res) => {
  const { nombre = 'No name', apellido, edad, page = '1', limit } = req.query;

  res.json({
    msg: 'Get api - controlador',
    nombre,
    apellido,
    edad,
    page,
    limit
  });
};

const usuariosPost = (req, res) => {
  const { nombre, edad } = req.body;
  res.json({
    msg: 'Post api - controlador',
    nombre,
    edad
  });
};

const usuariosPut = (req, res) => {
  const { id } = req.params;
  res.json({
    msg: 'Put api - controlador',
    id
  });
};

const usuariosDelete = (req, res) => {
  res.json({
    msg: 'Delete api - controlador'
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete
};
