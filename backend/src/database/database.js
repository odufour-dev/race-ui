

export default class Database {

  #logger
  #masterdb
  #mastername
  #schemapath
  #tools

  constructor(tools, schemapath, logger = console, mastername = "master") {
    this.#logger      = logger;
    this.#mastername  = mastername;
    this.#schemapath  = schemapath;
    this.#tools       = tools;
  }

  createCompetition(name) {

    const id = this.#tools.connector.getSafeDatabaseName(name);
    if (this.#tools.connector.isDatabaseExists(id)) throw new Error("EXIST_ERROR");        
    const db = this.#tools.connector.getDatabase(id);

    // Create the database from schema.sql
    try {
      const schema = this.#tools.files.readAbsoluteFile(this.#schemapath, 'utf8');
      db.exec(schema);
    } catch (e) {
      this.#tools.logger.error("SQL EXEC ERROR:", e);
      throw new Error("CANNOT_INITIALIZE_DB : " + e.message);
    }
    
    // Add meta-data into the base
    const metaTransaction = db.transaction((id,name) => {
      const insert = db.prepare('INSERT INTO metadata (id, name) VALUES (?, ?)');
      insert.run(id, name);
    });
    metaTransaction(id,name);

    // Insert the competition in the master database
    const masterTransaction = this.#masterdb.transaction((id,name) => {
      const insert = this.#masterdb.prepare('INSERT INTO competitions (id, name) VALUES (?, ?)');
      insert.run(id, name);
    });
    masterTransaction(id,name);

    return id;

  }

  initialize(){
    
    this.#masterdb  = this.#tools.connector.getDatabase(this.#mastername);

    const initSchema = this.#masterdb.transaction(() => {
      this.#masterdb.exec(`
        CREATE TABLE IF NOT EXISTS competitions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    });
    initSchema();
    this.#tools.logger.log(`Master database initialized (${this.#mastername})`);

  }

  listCompetitions() {
    return this.#masterdb.prepare('SELECT * FROM competitions').all();
  }

  readConfiguration(){

    try {
      const packagetext = this.#tools.files.readAbsoluteFile("../package.json");
      const { version = "x.x.x", name = "unknown" } = JSON.parse(packagetext);
      return {version, name};
    } catch (e) {
      const version = "x.x.x";
      const name = "invalid" ;
      return {version, name};
    }

  }

  syncRacers(competition, racers) {

    const dbPath = this.#tools.connector.getSafeDatabasePath(competition);
    if (!this.#tools.connector.isDatabaseExists(dbPath)) throw new Error("NOT_EXIST_ERROR");

    const db = this.#tools.connector.getDatabase(competition);
    const syncTransaction = db.transaction((data) => {
      db.prepare('DELETE FROM racers').run();
      const insert = db.prepare('INSERT INTO racers (id, data) VALUES (?, ?)');
      for (const r of data) insert.run(r.id, JSON.stringify(r));
    });
    syncTransaction(racers);
  }

}
