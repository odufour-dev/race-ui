
import { Connector } from "../tools/connector.js"
import { createCompetition }  from "./competition/Competition.js"
import { openMaster }         from "./master/Master.js"

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

  async createCompetition(name) {

    const id = this.#tools.connector.getSafeDatabaseName(name);
    if (this.#tools.connector.isDatabaseExists(id)) throw new Error("EXIST_ERROR");        
    
    const driver = this.#tools.connector.getDatabase(id);
    const competition = createCompetition(driver,name);
    await driver.sync();
    // TODO : Insert meta-data in competition database

    return this.#masterdb.registerCompetition(name, id + Connector.DATABASE_EXTENSION).then(() => id);

  }

  async initialize(){
    const driver    = this.#tools.connector.getDatabase(this.#mastername);
    this.#masterdb  = openMaster(driver);
    await driver.sync();
    this.#tools.logger.log(`Master database initialized (${this.#mastername})`);
  }

  listCompetitions() {
    return this.#masterdb.getAllCompetitions();
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
