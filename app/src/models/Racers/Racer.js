export class Racer {

  #age
  #category
  #club
  #id
  #firstname
  #ffcid
  #lastname
  #sex
  #uciid

  constructor( id = 0,firstName = "",lastName = "", sex = "", age = 0, category = "", club = "", uciID = "", ffcID = "") {
    this.#id           = id;
    this.#firstname   = firstName;
    this.#lastname    = lastName;
    this.#sex         = sex;
    this.#age         = age;
    this.#category    = category;
    this.#club        = club;
    this.#uciid       = uciID;
    this.#ffcid       = ffcID;
  }

  get age()       {return this.#age;}
  get category()  {return this.#category;}
  get club()      {return this.#club;}
  get ffcID()     {return this.#ffcid;}
  get firstName() {return this.#firstname;}
  get fullName()  {return `${this.#firstname} ${this.#lastname}`;}
  get id()        {return this.#id;}  
  get lastName()  {return this.#lastname;}   
  get sex()       {return this.#sex;}
  get uciID()     {return this.#uciid;}

  set age(value)      {this.#age        = value;}
  set category(value) {this.#category   = value;}
  set club(value)     {this.#club       = value;}
  set ffcID(value)    {this.#ffcid      = value;}
  set firstName(value){this.#firstname  = value;}
  set id(value)       {this.#id         = value;}
  set lastName(value) {this.#lastname   = value;}
  set sex(value)      {this.#sex        = value;}
  set uciID(value)    {this.#uciid      = value;}

  setProperty(prop,value){
    if (prop in this){
      this[prop] = value;
    }
  }

}