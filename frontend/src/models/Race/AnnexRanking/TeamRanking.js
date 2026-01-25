import AnnexRanking from "./AnnexRanking"

export class TeamRanking extends AnnexRanking {

    #nracers

    constructor(id,type,title,priority,nracers = 3){
      super(id,type,title,priority)
      this.#nracers = nracers;
    }

    get nracers(){return this.#nracers;}

    clone(){
      return new TeamRanking(this._id,this._type,this._title,this._priority,this.#nracers);
    }

    toJSON(){
      return {...super.toJSON(), nracers: this.#nracers};
    }

    update(settings){
      let data = this.clone();
      data.updateCommon(settings);
      if ("nracers" in settings){
        data.#nracers = Number(settings.nracers);
      }
      return data;
    }

}