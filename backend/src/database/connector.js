
import { Sequelize }            from 'sequelize';
import sqlite3                  from 'sqlite3';

import { createCompetition }    from "./competition/Competition.js"
import { openMaster }           from "./master/Master.js"
import { createMigrator }       from './migrator.js';

class Connector {

    static DATABASE_EXTENSION = ".db";

    #connections
    #competitions
    #files
    #logger
    #masterdb
    #migrator
    #rootfolder

    constructor(files,rootfolder,competitions,migrator,logger){
        this.#files         = files;
        this.#rootfolder    = rootfolder;
        this.#connections   = new Map();
        this.#competitions  = competitions;
        this.#migrator      = migrator;
        this.#logger        = logger;
    }

    get competitions()  { return this.#competitions; }
    get master()        { return this.#masterdb;    }

    async closeAll() {
        for (const [name, db] of this.#connections.entries()) {
            try {
                await db.close(); // Attendre la fermeture
            } catch (err) {
                this.#logger.error(`Error while closing ${name}:`, err);
            }
        }
        this.#connections.clear();
    }

    closeDatabase(name) {

        const safeName = this.getSafeDatabaseName(name);
        if (this.#connections.has(safeName)) {
            const db = this.#connections.get(safeName);
            db.close();
            this.#connections.delete(safeName);
            return true;
        }
        return false;
    }

    async getDatabase(id,name=null){ 

        id = this.#files.basename(id);
        const safeName = this.getSafeDatabaseName(id);
        
        if (this.#connections.has(safeName)) {
            return this.#connections.get(safeName);
        }

        const filename  = this.#files.joinPath(this.#rootfolder, safeName + Connector.DATABASE_EXTENSION);
        const driver    = new Sequelize({
            dialect: 'sqlite',
            storage: filename,
            logging: false,
            dialectModule: sqlite3
        }); 
        this.#competitions.create(driver,name || id);
        await this.#migrator.migrate(driver);
        await driver.sync();

        this.#connections.set(safeName, driver);
        return driver;
    }

    getSafeDatabaseName(name){
        return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    }

    async initialize(mastername = 'master'){
        try {

            const filename  = this.#files.joinPath(this.#rootfolder, mastername + Connector.DATABASE_EXTENSION);
            const driver    = new Sequelize({
                dialect: 'sqlite',
                storage: filename,
                logging: false,
                dialectModule: sqlite3
            }); 

            this.#masterdb  = openMaster(driver);
            await this.#migrator.migrate(driver);
            await driver.sync();
            this.#logger.log(`Master database initialized (${mastername})`);

        } catch (error) {
            this.#logger.error("Failed to initialize database", error);
            throw error;
        }
      }
   
    isDatabaseExists(name) {
        name = this.#files.basename(name);
        const filename  = this.#files.joinPath(this.#rootfolder, name + Connector.DATABASE_EXTENSION);
        return this.#connections.has(name) || this.#files.exists(this.#files.joinPath(filename));        
    }

    readConfiguration(){
        const filename = this.#files.joinPath(this.#rootfolder, "..","package.json");
        return this.#files.readFile(filename);        
    }

}

export default async function createConnector(files,rootfolder,mastername,logger=console){
    const competitions  = { create: async (driver,name) => createCompetition(driver,name)};
    const migrator      = createMigrator(files, rootfolder, logger);
    const connector     = new Connector(files,rootfolder,competitions,migrator,logger);
    await connector.initialize(mastername);
    return connector;    
}
