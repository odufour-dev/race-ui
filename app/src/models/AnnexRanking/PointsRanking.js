import AnnexRanking from "./AnnexRanking"

export class PointsRanking extends AnnexRanking {

  clone(){
    return new PointsRanking(this.id_,this.type_,this.title_,this.priority_);
  }

  update(settings){
    let data = this.clone();
    data.updateCommon(settings);
    return data;
  }

}