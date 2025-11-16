export class Stage {

    #id
    #name
    #date
    #distance

    constructor(id = 1, name = "", date = "", distance = 0){
        this.#id = id;
        this.#name = name;
        this.#date = date;
        this.#distance = distance;
    }

    get id(){return this.#id;}
    get name(){return this.#name;}
    get date(){return this.#date;}
    get distance(){return this.#distance;}

    clone(){
      return new Stage(this.#id,this.#name,this.#date,this.#distance);
    }

    update(stage){
        if ("id" in stage){
            this.#id = stage.id;
        }
        if ("name" in stage){
            this.#name = stage.name;
        }
        if ("date" in stage){
            this.#date = stage.date;
        }
        if ("distance" in stage){
            this.#distance = stage.distance;
        }
        return this.clone();
    }

}