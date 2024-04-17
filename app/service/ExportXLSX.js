const os = require('os');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const db = require('../models');

async function exportTablesToExcel(req, res, next) {
  const tables = await getTableNames();
  const workbook = xlsx.utils.book_new();

  for (let table of tables) {
    const data = await getTableData(table);
    const sheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, sheet, table);
  }
  const filename = 'export.xlsx';
  const filepath = path.join(os.tmpdir(), filename);
  const out = await xlsx.write(workbook, { bookType: 'xlsx', type: 'binary', bookSST: true });
  fs.writeFileSync(filepath, out);

  res.send({
    filename,
    filepath,
    out,
    });
}
//make the same function as above for each table but do not include the table documents
async function getTableNames() {
  const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name != 'document';
  `;
  const result = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT });
  return result.map(row => row.table_name);
}

async function getTableData(table) {
  const query = `SELECT * FROM "${table}";`;
  const result = await db.sequelize.query(query);
  return result[0];
}

module.exports = {
  exportTablesToExcel,
};