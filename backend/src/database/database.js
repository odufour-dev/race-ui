

export default class Database {

  #schemapath
  #tools

  constructor(tools, schemapath) {
    this.#schemapath  = schemapath;
    this.#tools       = tools;
  }

  listCompetitions(){/*
    const files = this.#tools.files.readAbsoluteDir(this.#dbfolder);
    return files
      .filter(file => file.endsWith('.db'))
      .map(file => ({
          id:   file.replace('.db', ''),
          name: file.replace('.db', '')
      }));*/
      return 0;
  }
 
  createCompetition(name) {

    const dbPath = this.getSafeDatabasePath(name);
    if (this.#tools.connector.isDatabaseExists(dbPath)) throw new Error("EXIST_ERROR");
    const id = this.#tools.files.getSafeDatabaseName(name);
    
    const db = this.#tools.connector.getDatabase(dbPath);
    const schema = this.#tools.files.readAbsoluteFile(this.#schemapath, 'utf8');
    db.exec(schema);
    const metaTransaction = db.transaction((id,name) => {
      const insert = db.prepare('INSERT INTO metadata (id, name) VALUES (?, ?)');
      insert.run(id, name);
    });
    metaTransaction(id,name);
    return id;

  }

  syncRacers(competition, racers) {

    const dbPath = this.getSafeDatabasePath(competition);
    if (!this.#tools.connector.isDatabaseExists(dbPath)) throw new Error("NOT_EXIST_ERROR");

    const db = this.#tools.connector.getDatabase(dbPath);
    const syncTransaction = db.transaction((data) => {
      db.prepare('DELETE FROM racers').run();
      const insert = db.prepare('INSERT INTO racers (id, data) VALUES (?, ?)');
      for (const r of data) insert.run(r.id, JSON.stringify(r));
    });
    syncTransaction(racers);
  }

}
