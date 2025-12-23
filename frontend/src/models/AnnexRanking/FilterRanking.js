import AnnexRanking from "./AnnexRanking"

export class FilterRanking extends AnnexRanking {

    constructor(id,type,title,priority,pattern = ""){
      super(id,type,title,priority)
      this.pattern_ = pattern;
    }

    clone(){
      return new FilterRanking(this.id_,this.type_,this.title_,this.priority_,this.pattern_);
    }

    update(settings){
      let data = this.clone();
      data.updateCommon(settings);
      if ("pattern" in settings){
        data.pattern_ = settings.pattern;
      }
      return data;
    }

}