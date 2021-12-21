const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { Usuario, Producto } = require('../models');
const { subirArchivo } = require('../helpers/subir-archivo');

const cargarArchivo = async (req, res) => {
  try {
    // Obtengo el path del archivo cargado
    const nombre = await subirArchivo(req.files, undefined, 'imgs');
    res.json({ nombre });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const actualizarImagen = async (req, res) => {
  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      res.status(500).json({
        msg: 'Opción no implementada'
      });
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  // Asigno el path de su imagen a la propiedad img del modelo
  modelo.img = await subirArchivo(req.files, undefined, coleccion);
  await modelo.save();

  res.json({
    id,
    coleccion,
    modelo
  });
};

const actualizarImagenCloudinary = async (req, res) => {
  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      res.status(500).json({
        msg: 'Opción no implementada'
      });
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    const nombreArray = modelo.img.split('/');
    const nombre = nombreArray[nombreArray.length - 1];
    const [publicId] = nombre.split('.');
    cloudinary.uploader.destroy(publicId);
  }

  // Guardo la imagen en cloudinary
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  // Asigno el path de su imagen a la propiedad img del modelo
  modelo.img = secure_url;
  await modelo.save();

  res.json({
    id,
    coleccion,
    modelo
  });
};

const mostrarImagen = async (req, res) => {
  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      res.status(500).json({
        msg: 'Opción no implementada'
      });
  }

  // Verifico que exista la imagen
  if (modelo.img) {
    return res.status(200).json({ img: modelo.img });
    // const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    // if (fs.existsSync(pathImg)) {
    //   return res.sendFile(pathImg);
    // }
  }
  const pathImg = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImg);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  actualizarImagenCloudinary,
  mostrarImagen
};
