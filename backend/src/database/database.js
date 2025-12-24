

export default class Database {

  #dbfolder
  #schemapath
  #tools

  constructor(tools, dbfolder, schemapath) {
    this.#dbfolder    = dbfolder;
    this.#schemapath  = schemapath;
    this.#tools       = tools;
  }

  getSafeDatabasePath(name){
    const dbName = this.#tools.files.getSafeDatabaseName(name) + ".db";
    return this.#tools.files.joinAbsolutePath(this.#dbfolder, dbName);
  }

  listCompetitions(){
    const files = this.#tools.files.readAbsoluteDir(this.#dbfolder);
    return files
      .filter(file => file.endsWith('.db'))
      .map(file => ({
          id:   file.replace('.db', ''),
          name: file.replace('.db', '')
      }));
  }
 
  createCompetition(name) {

    const dbPath = this.getSafeDatabasePath(name);
    if (this.#tools.connector.isDatabaseExists(dbPath)) throw new Error("EXIST_ERROR");
    
    const db = this.#tools.connector.getDatabase(dbPath);
    const schema = this.#tools.files.readAbsoluteFile(this.#schemapath, 'utf8');
    db.exec(schema);
    return this.#tools.files.getSafeDatabaseName(name);

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
