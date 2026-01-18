import AnnexRanking from "./AnnexRanking"

export class FilterRanking extends AnnexRanking {

    #pattern

    constructor(id,type,title,priority,pattern = ""){
      super(id,type,title,priority)
      this.#pattern = pattern;
    }

    clone(){
      return new FilterRanking(this._id,this._type,this._title,this._priority,this.#pattern);
    }

    toJSON(){
      return {...super.toJSON(), filter: this.#pattern};
    }

    update(settings){
      let data = this.clone();
      data.updateCommon(settings);
      if (settings.pattern){
        data.#pattern = settings.pattern;
      } else if (settings.filter){
        data.#pattern = settings.filter;
      }
      return data;
    }

}