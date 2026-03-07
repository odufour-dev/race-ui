
export class Navigation {

    #stages

    constructor(stages = []){
        this.#stages        = stages;
    }

    get stages(){return this.#stages;}

}

export function createNavigationFromJSON(data){
    return new Navigation(data.stages);
}
