const { subirArchivo } = require('../helpers/subir-archivo');

const cargarArchivo = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).send({
      msg: 'No hay archivos que subir'
    });
  }

  try {
    // Obtengo el path del archivo cargado
    const nombre = await subirArchivo(req.files, undefined, 'imgs');
    res.json({ nombre });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = {
  cargarArchivo
};
