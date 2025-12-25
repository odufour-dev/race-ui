
import Database from 'better-sqlite3';

export class Connector {

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
    
    getDatabase(name) {

        name = this.getSafeDatabaseName(name);
        if (this.isDatabaseExists(name)) {
            return this.#connections.get(name);
        }

        const dbPath = this.getSafeDatabasePath(name);
        try {
            const db = new Database(dbPath);
            this.#connections.set(name, db);
            return db;
        } catch (error) {
            throw new Error(`Cannot open database ${name}: ${error.message}`);
        }
    }

    getSafeDatabaseName(name){
        return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    }

    getSafeDatabasePath(name){
        const dbName = this.getSafeDatabaseName(name) + ".db";
        return this.#files.joinAbsolutePath(this.#rootfolder, dbName);
    }

    isDatabaseExists(name) {
        return this.#connections.has(name);        
    }

}

export function createConnectorFromFolder(files,rootfolder,logger=console){
    return new Connector(files,rootfolder,logger);
}
