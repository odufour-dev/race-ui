
import { Annex }        from "./Annex.js";
import { Event }        from "./Event.js";
import { Race }         from "./Race.js";
import { Racer }        from "./Racer.js";
import { Registration } from "./Registration.js";
import { Result }       from "./Result.js";
import { Stage }        from "./Stage.js";

export class Competition {

    #annex
    #driver
    #event
    #race
    #racer
    #registration
    #result
    #stage

    constructor(driver,annex,event,race,racer,registration,result,stage){
        this.#annex         = annex;
        this.#driver        = driver;
        this.#event         = event;
        this.#race          = race;
        this.#racer         = racer;
        this.#registration  = registration;
        this.#result        = result;
        this.#stage         = stage;
    }

    get Annex()         {return this.#annex;        }
    get Event()         {return this.#event;        }
    get Race()          {return this.#race;         }
    get Racer()         {return this.#racer;        }
    get Registration()  {return this.#registration; }
    get Results()       {return this.#result;       }
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
            as: 'Annexes',
            foreignKey: 'raceId',
            onDelete: 'CASCADE' 
        });
        this.#annex.belongsTo(this.#race, { 
            as: 'race',
            foreignKey: 'raceId' 
        });

        this.#race.hasMany(this.#event, { 
            as: 'Events',
            foreignKey: 'raceId',
            onDelete: 'CASCADE' 
        });
        this.#event.belongsTo(this.#race, { 
            foreignKey: 'raceId' 
        });

        this.#annex.hasMany(this.#event, { 
            as: 'Events',
            foreignKey: 'annexId',
            onDelete: 'CASCADE'
        });
        this.#event.belongsTo(this.#annex, { 
            as: 'Type',
            foreignKey: 'annexId' 
        });

/*
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
*/
    }
    
}

export const createCompetition = (driver,name) => {

   const annex         = Annex.initialize(driver);
   const event         = Event.initialize(driver);
   const race          = Race.initialize(driver);
   const racer         = Racer.initialize(driver);
   const registration  = Registration.initialize(driver);
   const result        = Result.initialize(driver);
   const stage         = Stage.initialize(driver);

    const db = new Competition(driver,annex,event,race,racer,registration,result,stage);
    db.initialize();
    return db;
    
}


/*
// Table de liaison pour les points dans les classements annexes
// Un Rider peut avoir des points dans différents classements
const AnnexResult = driver.define('annex_result', {
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
