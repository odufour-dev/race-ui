
import { Connector }          from "../tools/connector.js"
import { createCompetition }  from "./competition/Competition.js"
import { openMaster }         from "./master/Master.js"

export default class Database {

  #logger
  #masterdb
  #mastername
  #tools
  #ready

  constructor(tools, logger = console, mastername = "master") {
    this.#logger      = logger;
    this.#mastername  = mastername;
    this.#tools       = tools;
    this.#ready       = false;
  }

  async createCompetition(name) {

    if (!this.#ready) throw new Error("DATABASE_NOT_INITIALIZED");

    const id = this.#tools.connector.getSafeDatabaseName(name);
    if (this.#tools.connector.isDatabaseExists(id)) throw new Error("EXIST_ERROR");        
    
    const driver = this.#tools.connector.getDatabase(id);
    const competition = createCompetition(driver,name);
    await driver.sync();
    // TODO : Insert meta-data in competition database

    try {
      await this.#masterdb.registerCompetition(name, id + Connector.DATABASE_EXTENSION);
      return id;
    } catch (err) {
      this.#logger.error("Failed to register competition in master", err);
      throw err;
    }

  }

  async initialize(){
    try {
      const driver    = this.#tools.connector.getDatabase(this.#mastername);
      this.#masterdb  = openMaster(driver);
      await driver.sync();
      this.#ready = true;
      this.#logger.log(`Master database initialized (${this.#mastername})`);
    } catch (error) {
      this.#logger.error("Failed to initialize database", error);
      throw error;
    }
  }

  listCompetitions() {
    if (!this.#ready) throw new Error("DATABASE_NOT_INITIALIZED");
    return this.#masterdb.getAllCompetitions();
  }

  readConfiguration(){

    try {
      const packagetext = this.#tools.connector.readConfiguration();
      const { version = "x.x.x", name = "unknown" } = JSON.parse(packagetext);
      return {version, name};
    } catch (e) {
      const version = "x.x.x";
      const name = "invalid" ;
      return {version, name};
    }

  }
/*
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
*/
}
