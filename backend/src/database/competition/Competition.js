
import { Annex }        from "./Annex.js";
import { AnnexResult }  from "./AnnexResult.js";
import { Event }        from "./Event.js";
import { Race }         from "./Race.js";
import { Racer }        from "./Racer.js";
import { Registration } from "./Registration.js";
import { Stage }        from "./Stage.js";
import { StageResult }  from "./StageResult.js";

export class Competition {

    #annex
    #annexresult
    #driver
    #event
    #race
    #racer
    #registration
    #stageresult
    #stage

    constructor(driver,annex,annexresult,event,race,racer,registration,stage,stageresult){
        this.#annex         = annex;
        this.#annexresult   = annexresult;
        this.#driver        = driver;
        this.#event         = event;
        this.#race          = race;
        this.#racer         = racer;
        this.#registration  = registration
        this.#stage         = stage;
        this.#stageresult   = stageresult;
    }

    get Annex()         {return this.#annex;        }
    get AnnexResult()   {return this.#annexresult;  }
    get Event()         {return this.#event;        }
    get Race()          {return this.#race;         }
    get Racer()         {return this.#racer;        }
    get Registration()  {return this.#registration; }
    get Stage()         {return this.#stage;        }
    get StageResult()   {return this.#stageresult;  }

    initialize(){
        
        // Relation Many-to-Many entre Race et Racer via Registration
        this.#race.belongsToMany(this.#racer, { 
            through: this.#registration,
            as: 'racers',
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
            as: 'stages',
            foreignKey: 'raceId',
            onDelete: 'CASCADE' 
        });
        this.#stage.belongsTo(this.#race, { 
            as: 'race',
            foreignKey: 'raceId' 
        });

        // An annex ranking belong to a race
        this.#race.hasMany(this.#annex, { 
            as: 'annexes',
            foreignKey: 'raceId',
            onDelete: 'CASCADE' 
        });
        this.#annex.belongsTo(this.#race, { 
            as: 'race',
            foreignKey: 'raceId' 
        });

        this.#stage.hasMany(this.#event, { 
            as: 'stageevents',
            foreignKey: 'stageId',
            onDelete: 'CASCADE' 
        });
        this.#event.belongsTo(this.#stage, { 
            as: 'stage',
            foreignKey: 'stageId' 
        });

    }
    
}

export const createCompetition = async (driver,name) => {

   const annex         = Annex.initialize(driver);
   const annexresult   = AnnexResult.initialize(driver);
   const event         = Event.initialize(driver);
   const race          = Race.initialize(driver);
   const racer         = Racer.initialize(driver);
   const registration  = Registration.initialize(driver);
   const stage         = Stage.initialize(driver);
   const stageresult   = StageResult.initialize(driver);

    const db = new Competition(driver,annex,annexresult,event,race,racer,registration,stage,stageresult);
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
