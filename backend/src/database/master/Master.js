
import { Index } from './Index.js';

class Master {

    #driver;
    #index;

    constructor(driver,index) {
        this.#driver = driver;
        this.#index  = index;
    }

    initialize(){}

    async registerCompetition(name, filename) {
        return await this.#index.create({
            name,
            filename: filename,
            status: 'active'
        });
    }

    async getAllCompetitions() {
        return await this.#index.findAll();
    }
    
}

export const openMaster = (driver) => {
    
    const index = Index.initialize(driver);
    const db = new Master(driver,index);
    db.initialize();
    return db;
    
}