
class AnnexRanking {

  constructor(id, type, title = "", priority = 1){
    this.id_ = id;
    this.type_ = type;
    this.title_ = title;
    this.priority_ = priority;
  }

  get id(){
    return this.id_;
  }

  get title(){
    return this.title_;
  }

  get type(){
    return this.type_;
  }

  get priority(){
    return this.priority_;
  }
  set priority(p){
    this.priority_ = p;
  }

  updateCommon(settings){
    if ("title" in settings){
      this.title_ = settings.title;
    }
    if ("priority" in settings){
      this.priority_ = settings.priority;
    }
  }

}

export class FilterRanking extends AnnexRanking {

    update(settings){
        this.updateCommon(settings);
        return new FilterRanking(this.id_,this.type_,this.title_,this.priority_);
    }

}

export class PointsRanking extends AnnexRanking {

    update(settings){
        this.updateCommon(settings);
        return new PointsRanking(this.id_,this.type_,this.title_,this.priority_);
    }

}

export class TeamRanking extends AnnexRanking {

    update(settings){
        this.updateCommon(settings);
        return new TeamRanking(this.id_,this.type_,this.title_,this.priority_);
    }

}

export class RankingFactory {

    constructor(){
        this.mapping_ = {
            "points":   (id) => new PointsRanking(id, "points"),
            "team":     (id) => new TeamRanking(id, "team"),
            "filter":   (id) => new FilterRanking(id, "filter"),
        };
    }

    get list(){
        return Object.keys(this.mapping_);
    }

    build(type,id){
        return this.mapping_[type](id);
    }

}

export class EventSettings {

  constructor(nstages = 1, annexrankings = [], rankingfactory = new RankingFactory()){
    this.nstages_ = nstages;
    this.annexrankings_ = annexrankings;
    this.rankingfactory_ = rankingfactory;
  }

  get nStages(){
    return this.nstages_;
  }
  set nStages(nstages){
    this.nstages_ = nstages;
  }
  get annexRankings(){
    return this.annexrankings_;
  }
  get annexRankingTypes(){
    return this.rankingfactory_.list;
  }

  addAnnexRanking(type,id){
    const ranking = this.rankingfactory_.build(type,id);
    this.annexrankings_.push(ranking);
    return this.clone();
  }

  clone(){
    return new EventSettings(this.nstages_, this.annexrankings_,this.rankingfactory_);
  }

  update(settings){

    if (settings.nStages){
      this.nstages_ = settings.nStages;
    }

    if (settings.annexRankings){
        this.annexrankings_ = settings.annexRankings.map((r) => {
            const ranking = this.rankingfactory_.build(r.type,r.id);
            return ranking.update(r);
        })
    }
    return this.clone();
  }

}