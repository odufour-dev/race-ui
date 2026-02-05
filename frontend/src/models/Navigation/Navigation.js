
export class Navigation {

    #annexrankings
    #stages

    constructor(stages = [], annexrankings = []){
        this.#annexrankings = annexrankings;
        this.#stages        = stages;
    }

    get stages(){return this.#stages;}

}

export function createNavigationFromJSON(data){
    return new Navigation(data.stages, data.annex);
}
