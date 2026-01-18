export default class AnnexRanking {

  _id
  _type
  _title
  _priority

  constructor(id, type, title = "", priority = 1){
    this._id        = id;
    this._type      = type;
    this._title     = title;
    this._priority  = priority;
  }

  get id(){return this._id; }
  get title(){return this._title;}
  get type(){return this._type; }
  get priority(){return this._priority;}

  set priority(p){this._priority = p;}

  toJSON(){
    return {
      name:       this._id,
      type:       this._type,
      title:      this._title,
      priority:   this._priority,
    };
  }

  updateCommon(settings){
    if ("title" in settings){
      this._title = settings.title;
    } else {
      this._title = this._id;
    }
    if ("priority" in settings){
      this._priority = settings.priority;
    }
  }

}