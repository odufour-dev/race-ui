
import { Index } from './Index.js';

export class Master {

    #driver;
    #index;

    constructor(driver,index) {
        this.#driver = driver;
        this.#index  = index;
    }

    async findCompetition(id){
        return await this.#driver.models.competitions.findOne({where: {filename: id + '.db'}});
    }

    async registerCompetition(name, filename, id) {
        return await this.#index.create({
            name: name,
            filename: filename,
            raceId: id,
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