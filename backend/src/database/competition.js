
import { Sequelize }    from 'sequelize';

import { Annex }        from "./competition/Annex.js";
import { Race }         from "./competition/Race.js";
import { Racer }        from "./competition/Racer.js";
import { Registration } from "./competition/Registration.js";
import { Result }       from "./competition/Result.js";
import { Stage }        from "./competition/Stage.js";

export class Competition {

    #annex
    #race
    #racer
    #sequelize
    #registration
    #result
    #stage

    constructor(sequelize,annex,race,racer,registration,result,stage){
    //constructor(sequelize){
        this.#sequelize     = sequelize;
        this.#annex         = annex;
        this.#race          = race;
        this.#racer         = racer;
        this.#registration  = registration;
        this.#result       = result;
        this.#stage         = stage;
    }

    get Annex()         {return this.#annex;        }
    get Race()          {return this.#race;         }
    get Racer()         {return this.#racer;        }
    get Registration()  {return this.#registration; }
    get Results()       {return this.#result;      }
    get Stage()         {return this.#stage;        }

    initialize(){
        
        // Relation Many-to-Many entre Race et Racer via Registration
        this.#race.belongsToMany(this.#racer, { 
            through: this.#registration,
            as: 'Racers',
            foreignKey: 'raceId',
            otherKey: 'racerId'
        });
        this.#racer.belongsToMany( this.#race, { 
            through: this.#registration,
            as: 'races',
            foreignKey: 'racerId',
            otherKey: 'raceId'
        });

        // A race has many stages
        this.#race.hasMany(this.#stage, { 
            as: 'Stages',
            foreignKey: 'raceId',
            onDelete: 'CASCADE' 
        });
        this.#stage.belongsTo(this.#race, { 
            as: 'race',
            foreignKey: 'raceId' 
        });

        // Results are linked to the stage
        this.#stage.hasMany(this.#result, { 
            as: 'Results',
            foreignKey: 'stageId',
            onDelete: 'CASCADE' 
        });
        this.#result.belongsTo(this.#stage, { 
            as: 'stage',
            foreignKey: 'stageId' 
        });

        // A result is associated to a racer
        this.#racer.hasMany(this.#result, { 
            as: 'Results',
            foreignKey: 'racerId',
            onDelete: 'CASCADE' 
        });
        this.#result.belongsTo(this.#racer, { 
            as: 'racer',
            foreignKey: 'racerId' 
        });

        // An annex ranking belong to a race
        this.#race.hasMany(this.#annex, { 
            as: 'Annex',
            foreignKey: 'raceId',
            onDelete: 'CASCADE' 
        });
        this.#annex.belongsTo(this.#race, { 
            as: 'race',
            foreignKey: 'raceId' 
        });

        // A annex ranking is associated to a racer
        this.#racer.hasMany(this.#annex, { 
            as: 'Annex',
            foreignKey: 'racerId',
            onDelete: 'CASCADE' 
        });
        this.#annex.belongsTo(this.#racer, { 
            as: 'racer',
            foreignKey: 'racerId' 
        });

    }

    async sync(options = {}) {
        return await this.#sequelize.sync(options);
    }

    async close() {
        await this.#sequelize.close();
    }
    
}

export const createCompetition = (name,path,driver) => {
    
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path,
        logging: false,
        dialectModule: driver
    });

   const annex         = Annex.initialize(sequelize);
   const race          = Race.initialize(sequelize);
   const racer         = Racer.initialize(sequelize);
   const registration  = Registration.initialize(sequelize);
   const result        = Result.initialize(sequelize);
   const stage         = Stage.initialize(sequelize);

    const db = new Competition(sequelize,annex,race,racer,registration,result,stage);
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
