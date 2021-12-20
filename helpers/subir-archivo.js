const path = require('path');
const { v4: uuid } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
  return new Promise((resolve, reject) => {
    // Obtengo el archivo enviado
    const { archivo } = files;

    // Obtengo la extensión
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extensión
    if (!extensionesValidas.includes(extension)) {
      return reject(`Extensiones permitidas ${extensionesValidas}`);
    }

    // Le asigno un identificador al archivo
    const nombreTemp = uuid() + '.' + extension;

    // Defino la ruta a donde se debe guardar
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

    // Muevo la imagen cargada a la ruta definida
    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(uploadPath);
    });
  });
};

module.exports = {
  subirArchivo
};
