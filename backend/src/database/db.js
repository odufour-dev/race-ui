
import { Sequelize } from 'sequelize';

import { AnnexResult }  from "./AnnexResults.js";
import { Race }         from "./Race.js";
import { Racer }        from "./Racer.js";
import { Registration } from "./Registration.js";
import { Results }      from "./Results.js";
import { Stage }        from "./Stage.js";

export class Database {

    #annex
    #race
    #racer
    #sequelize
    #registration
    #results
    #stage

    constructor(sequelize,annex,race,racer,registration,results,stage){
        this.#sequelize     = sequelize;
        this.#annex         = annex;
        this.#race          = race;
        this.#racer         = racer;
        this.#registration  = registration;
        this.#results       = results;
        this.#stage         = stage;
    }

    initialize(){

        // Relation Many-to-Many entre Race et Racer via Registration
        this.#race.belongsToMany(this.#racer, { through: this.#registration });
        this.#racer.belongsToMany(this.#race, { through: this.#registration });

        // A race has many stages
        this.#race.hasMany(this.#stage, { onDelete: 'CASCADE' });
        this.#stage.belongsTo(this.#race);

        // Results are linked to the stage
        this.#stage.hasMany(this.#results);
        this.#results.belongsTo(this.#stage);

        // A result is associated to a racer
        this.#racer.hasMany(this.#results, { foreignKey: 'racerId' });
        this.#results.belongsTo(this.#racer);

        // An annex ranking belong to a race
        this.#race.hasMany(this.#annex);
        this.#annex.belongsTo(this.#race);

        // TODO
        // this.#racer.belongsToMany(this.#annex, { through: 'AnnexResults_Racer' });

    }

    async sync(options = {}) {
        return await this.#sequelize.sync(options);
    }
    
}

export const createDatabase = () => {

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'database.sqlite', // FIXME : Pass the full path to database file
        dialectModulePath: 'better-sqlite3',
        logging: false,             // Optionnel : passe à console.log pour voir les requêtes SQL
    });

    const annex         = AnnexResult.initialize(sequelize);
    const race          = Race.initialize(sequelize);
    const racer         = Racer.initialize(sequelize);
    const registration  = Registration.initialize(sequelize);
    const results       = Results.initialize(sequelize);
    const stage         = Stage.initialize(sequelize);

    const db = new Database(sequelize,annex,race,racer,registration,results,stage);
    db.initialize();
    return db;
}


/*
// Table de liaison pour les points dans les classements annexes
// Un Rider peut avoir des points dans différents classements
const AnnexResult = sequelize.define('annex_result', {
  points: DataTypes.INTEGER,
  rank: DataTypes.INTEGER
});
*/
/* Get stage ranking
const stageResults = await Results.findAll({
  where: { stageId: 1 },
  order: [['rank', 'ASC']],
  include: [Rider] // Pour avoir le nom du coureur avec le résultat
});
*/
