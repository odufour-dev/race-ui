/* src/database/MasterDatabase.js */
import { Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';
import { CompetitionIndex } from './master/CompetitionIndex.js';

export class MasterDatabase {
    #sequelize;
    #index;

    constructor(dbPath) {
        this.#sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbPath,
            logging: false,
            dialectModule: sqlite3
        });
        this.#index = CompetitionIndex.initialize(this.#sequelize);
    }

    async sync() {
        return await this.#sequelize.sync();
    }

    // Méthode pour enregistrer une nouvelle course
    async registerCompetition(name, fileName) {
        return await this.#index.create({
            name,
            dbFileName: fileName,
            status: 'active'
        });
    }

    async getAllCompetitions() {
        return await this.#index.findAll();
    }
}