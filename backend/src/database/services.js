import Database from 'better-sqlite3';

class DBConnector {

    #paths
    #fs

    constructor(paths, fs){
        this.#paths = paths;
        this.#fs = fs;
    }

    isDatabaseExists(name) {
        const dbPath = this.#paths.getSafeDatabasePath(name);
        return this.#fs.existsSync(dbPath);        
    }
    
    getDatabase(name) {
        const dbPath = this.#paths.getSafeDatabasePath(name);
        return new Database(dbPath);
    }

}

export default class DatabaseService {

    #connector
    #paths
    #fs

    constructor(fs, paths,connector = null) {
        this.#fs        = fs;
        this.#paths     = paths;
        this.#connector = connector ? connector : new DBConnector(paths, fs);
    }

 
  createCompetition(name) {

    if (this.#connector.isDatabaseExists(name)) throw new Error("EXIST_ERROR");
    
    const db = this.#connector.getDatabase(name);
    const schema = this.#fs.readFileSync(this.#paths.schemaPath, 'utf8');
    db.exec(schema);
    return this.#paths.getSafeDatabaseName(name);

  }

  syncRacers(competition, racers) {

    if (!this.#connector.isDatabaseExists(competition)) throw new Error("NOT_EXIST_ERROR");

    const db = this.#connector.getDatabase(competition);
    const syncTransaction = db.transaction((data) => {
      db.prepare('DELETE FROM racers').run();
      const insert = db.prepare('INSERT INTO racers (id, data) VALUES (?, ?)');
      for (const r of data) insert.run(r.id, JSON.stringify(r));
    });
    syncTransaction(racers);
  }

}
