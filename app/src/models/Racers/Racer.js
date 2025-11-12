export class Racer {

  constructor( id = "",firstName = "",lastName = "", sex = "", age = "", category = "", club = "", uciID = "", ffcID = "", stageRank = [], annexRank = []) {
    this.id           = id;
    this.firstname_   = firstName;
    this.lastname_    = lastName;
    this.sex_         = sex;
    this.age_         = age;
    this.category_    = category;
    this.club_        = club;
    this.uciid_       = uciID;
    this.ffcid_       = ffcID;
    this.stagerank_   = stageRank;
    this.annexrank_   = annexRank;
  }

  get id(){return this.id_;}
  set id(value){this.id_ = value;}
  get firstName(){return this.firstname_;}
  set firstName(value){this.firstname_ = value;}
  get lastName(){return this.lastname_;}
  set lastName(value){this.lastname_ = value;}
  get sex(){return this.sex_;}
  set sex(value){this.sex_ = value;}
  get age(){return this.age_;}
  set age(value){this.age_ = value;}
  get category(){return this.category_;}
  set category(value){this.category_ = value;}
  get club(){return this.club_;}
  set club(value){this.club_ = value;}
  get uciID(){return this.uciid_;}
  set uciID(value){this.uciid_ = value;}
  get ffcID(){return this.ffcid_;}
  set ffcID(value){this.ffcid_ = value;}
  get StageRank(){return this.stagerank_;}
  set StageRank(value){this.stagerank_ = value;}
  get AnnexRank(){return this.annexrank_;}
  set AnnexRank(value){this.annexrank_ = value;}

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

}