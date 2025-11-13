import AnnexRanking from "./AnnexRanking"

export class TeamRanking extends AnnexRanking {

    constructor(id,type,title,priority,nracers = 3){
      super(id,type,title,priority)
      this.nracers_ = nracers;
    }

    get nracers(){return this.nracers_;}

    clone(){
      return new TeamRanking(this.id_,this.type_,this.title_,this.priority_,this.nracers_);
    }

    update(settings){
      let data = this.clone();
      data.updateCommon(settings);
      if ("nracers" in settings){
        data.nracers_ = settings.nracers;
      }
      return data;
    }

}