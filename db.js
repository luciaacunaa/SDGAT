const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

const dbPath = process.env.DB_PATH || path.join(app.getPath('userData'), 'amate.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS clientas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT NOT NULL,
    telefono TEXT NOT NULL,
    calle TEXT NOT NULL,
    numero TEXT NOT NULL,
    piso TEXT,
    localidad TEXT NOT NULL,
    provincia TEXT NOT NULL,
    codigo_postal TEXT NOT NULL
  )
`);

module.exports = {
  crear: (c) =>
    db.prepare(`
      INSERT INTO clientas (nombre, apellido, dni, telefono, calle, numero, piso, localidad, provincia, codigo_postal)
      VALUES (@nombre, @apellido, @dni, @telefono, @calle, @numero, @piso, @localidad, @provincia, @codigoPostal)
    `).run(c),
  listar: () => db.prepare('SELECT * FROM clientas ORDER BY apellido').all(),
  obtener: (id) => db.prepare('SELECT * FROM clientas WHERE id = ?').get(id),
};