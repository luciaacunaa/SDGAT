const PDFDocument = require('pdfkit');
const fs = require('fs');

// Completá con los datos reales de Rosana
const REMITENTE = {
  nombre: 'Amate Indumentaria',
  direccion: 'Completar',
  localidad: 'Completar',
  telefono: 'Completar',
};

// Formatos de ejemplo. Después los ajustamos al diseño real de cada empresa
const FORMATOS = {
  'Correo Argentino': { size: [283, 425], titulo: 'CORREO ARGENTINO' },
  Andreani: { size: 'A6', titulo: 'ANDREANI' },
  OCA: { size: 'A5', titulo: 'OCA' },
};

function generar(c, empresa, ruta) {
  return new Promise((resolve, reject) => {
    const f = FORMATOS[empresa];
    if (!f) return reject(new Error('Empresa inválida'));

    const doc = new PDFDocument({ size: f.size, margin: 20 });
    const out = fs.createWriteStream(ruta);
    doc.pipe(out);

    doc.fontSize(16).text(f.titulo, { align: 'center' }).moveDown();

    doc.fontSize(9).text('DESTINATARIO', { underline: true });
    doc.fontSize(14).text(`${c.nombre} ${c.apellido}`);
    doc.fontSize(11)
      .text(`${c.calle} ${c.numero}${c.piso ? ' - Piso ' + c.piso : ''}`)
      .text(`${c.localidad}, ${c.provincia} (CP ${c.codigo_postal})`)
      .text(`DNI: ${c.dni}`)
      .text(`Tel: ${c.telefono}`)
      .moveDown();

    doc.fontSize(9).text('REMITENTE', { underline: true });
    doc.fontSize(10)
      .text(REMITENTE.nombre)
      .text(`${REMITENTE.direccion}, ${REMITENTE.localidad}`)
      .text(`Tel: ${REMITENTE.telefono}`);

    doc.end();
    out.on('finish', resolve);
    out.on('error', reject);
  });
}

module.exports = { generar, EMPRESAS: Object.keys(FORMATOS) };