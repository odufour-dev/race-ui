const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { DB_FOLDER, SCHEMA_PATH } = require('../config/paths');

const getSafePath = (name) => path.join(DB_FOLDER, `${name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.db`);

const dbService = {
  getDB(name) {
    const dbPath = getSafePath(name);
    if (!fs.existsSync(dbPath)) throw new Error("Compétition introuvable.");
    return new Database(dbPath);
  },

  createCompetition(name) {
    const safeName = name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    const dbPath = getSafePath(name);
    if (fs.existsSync(dbPath)) throw new Error("EXIST_ERROR");

    const db = new Database(dbPath);
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schema);
    return safeName;
  },

  syncRacers(competition, racers) {
    const db = this.getDB(competition);
    const syncTransaction = db.transaction((data) => {
      db.prepare('DELETE FROM racers').run();
      const insert = db.prepare('INSERT INTO racers (id, data) VALUES (?, ?)');
      for (const r of data) insert.run(r.id, JSON.stringify(r));
    });
    syncTransaction(racers);
  },

  // ... Ajoutez ici syncRankings, syncRaceInfo, etc.
};

module.exports = dbService;