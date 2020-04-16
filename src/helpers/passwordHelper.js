const Bcrypt = require("bcrypt");
const { promisify } = require("util");

const hashAsync = promisify(Bcrypt.hash);
const compareAscyn = promisify(Bcrypt.compare);
const saltComplex = parseInt(process.env.SALT_PWD);

class PasswordHelper {
  static hashPassword(pwd) {
    return hashAsync(pwd, saltComplex);
  }
  static comparePassword(pwd, hash) {
    return compareAscyn(pwd, hash);
  }
}

module.exports = PasswordHelper;
