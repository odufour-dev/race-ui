
import Database from 'better-sqlite3';

export class Connector {

    #files

    constructor(files){
        this.#files = files;
    }

    isDatabaseExists(dbPath) {
        return this.#files.exists(dbPath);        
    }
    
    getDatabase(dbPath) {
        return new Database(dbPath);
    }

}

export function createConnector(files){
    return new Connector(files);
}
