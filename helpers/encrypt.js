const bcryptjs = require('bcryptjs');

const encriptar = (password) => {
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salt);
};

module.exports = {
  encriptar
};
