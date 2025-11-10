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
    ranking.priority = this.annexrankings_.length + 1;
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

    let data = this.clone();
    if (settings.stages){
      data.stages_ = settings.stages.map((s,idx) => {
        const stage = new Stage(s.id ?? idx+1);
        return stage.update(s);
      });
    }

    if (settings.annexRankings){
        data.annexrankings_ = settings.annexRankings.map((r) => {
            const ranking = data.rankingfactory_.build(r.type,r.id);
            return ranking.update(r);
        })
    }
    return data;
  }

}