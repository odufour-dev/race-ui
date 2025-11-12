export class Stage {

    constructor(id = 1, name = "", date = "", distance = 0){
        this.id_ = id;
        this.name_ = name;
        this.date_ = date;
        this.distance_ = distance;
    }

    get id(){return this.id_;}
    get name(){return this.name_;}
    get date(){return this.date_;}
    get distance(){return this.distance_;}

    clone(){
      return new Stage(this.id_,this.name_,this.date_,this.distance_);
    }

    update(stage){
        if ("id" in stage){
            this.id_ = stage.id;
        }
        if ("name" in stage){
            this.name_ = stage.name;
        }
        if ("date" in stage){
            this.date_ = stage.date;
        }
        if ("distance" in stage){
            this.distance_ = stage.distance;
        }
        return this.clone();
    }

}