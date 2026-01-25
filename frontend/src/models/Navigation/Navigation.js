
import { NavigationGroup }      from "./NavigationGroup";
import { NavigationItem }       from "./NavigationItem";
import { NavigationRegistry }   from "./NavigationRegistry";

export class Navigation {

    #annexrankings
    #stages

    constructor(stages = [], annexrankings = []){
        this.#annexrankings = annexrankings;
        this.#stages        = stages;
    }

    get annexRankingTitles()    {return this.#annexrankings.map((a) => a.title);}
    get isavailable()           {return this.#stages.length > 0;                }
    get nStages()               {return this.#stages.length;                    }
    get stageIds()              {return this.#stages.map((s) => s.id);          }
    get stageNames()            {return this.#stages.map((s) => s.name);        }

    addItem(id, title, order, component = null){
        return new NavigationItem({ id: id, title: title, order: order, component: component });
    }
    addGroup(id, title, order, items = []){
        return new NavigationGroup({ id: id,  title: title,  order: order, items: items });
    }
    createRegistry(groups){
        return new NavigationRegistry(groups)
    }

}

export function createNavigationFromJSON(data){
    return new Navigation(data.stages, data.annex);
}
