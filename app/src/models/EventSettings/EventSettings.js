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
        return new Stage(this.id_,this.name_,this.date_,this.distance_);
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

  constructor(stages = [new Stage()], annexrankings = [], rankingfactory = new RankingFactory()){
    this.stages_ = stages;
    this.annexrankings_ = annexrankings;
    this.rankingfactory_ = rankingfactory;
  }

  get nStages(){
    return this.stages_.length;
  }
  get stages(){
    return this.stages_;
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

  addStage(){
    const stage = new Stage(this.stages_.length + 1);
    this.stages_.push(stage);
    return this.clone();
  }

  clone(){
    return new EventSettings(this.stages_, this.annexrankings_, this.rankingfactory_);
  }

  update(settings){

    if (settings.stages){
      this.stages_ = settings.stages.map((s,idx) => {
        const stage = new Stage(s.id ?? idx+1);
        return stage.update(s);
      });
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