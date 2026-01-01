
import { Index } from './Index.js';

export class Master {

    #driver;
    #index;

    constructor(driver,index) {
        this.#driver = driver;
        this.#index  = index;
    }

    async registerCompetition(name, filename) {
        return await this.#index.create({
            name: name,
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
    return db;
    
}