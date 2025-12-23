const path = require('path');
const fs = require('fs');

const DB_FOLDER = path.join(__dirname, '../../db');
if (!fs.existsSync(DB_FOLDER)) {
  fs.mkdirSync(DB_FOLDER, { recursive: true });
}

module.exports = {
  DB_FOLDER,
  SCHEMA_PATH: path.join(__dirname, '../schema.sql'),
  FRONTEND_BUILD_PATH: path.join(__dirname, '../../../frontend/build')
};