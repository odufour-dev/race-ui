export default class AnnexRanking {

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