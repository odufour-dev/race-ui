
import { Sequelize }    from 'sequelize';
import sqlite3          from 'sqlite3';

export class Connector {

    static DATABASE_EXTENSION = ".db";

    #connections
    #files
    #logger
    #rootfolder

    constructor(files,rootfolder,logger){
        this.#files         = files;
        this.#rootfolder    = rootfolder;
        this.#connections   = new Map();
        this.#logger        = logger;        
    }

    closeAll() {
        for (const [name, db] of this.#connections.entries()) {
            try {
                db.close();
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

    getDatabase(name){

        name = this.getSafeDatabaseName(name);
        if (this.#connections.has(name)){
            return this.#connections.get(name);
        }

        const filename = this.#files.joinPath(this.#rootfolder, name + Connector.DATABASE_EXTENSION);
        const driver = new Sequelize({
            dialect: 'sqlite',
            storage: filename,
            logging: false,
            dialectModule: sqlite3
        });
        this.#connections.set(name, driver);
        return driver;
    }

    getSafeDatabaseName(name){
        return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    }
   
    isDatabaseExists(name) {
        return this.#connections.has(name);        
    }

    readConfiguration(){
        const filename = this.#files.joinPath(this.#rootfolder, "..","package.json");
        return this.#files.readFile(filename);        
    }

}

export function createConnectorFromFolder(files,rootfolder,logger=console){
    return new Connector(files,rootfolder,logger);
}
