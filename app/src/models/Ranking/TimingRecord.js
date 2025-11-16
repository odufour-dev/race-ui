
export class TimingRecord {

  #bib
  #stage
  #position
  #time
  #status

  constructor(bib, stage, position, time, status) {
    this.#bib       = bib;
    this.#stage     = stage;
    this.#position  = position;
    this.#time      = time;
    this.#status    = status;
  }

  get bib()     {return this.#bib;      }
  get position(){return this.#position; }
  get stage()   {return this.#stage;    }
  get status()  {return this.#status;   }
  get time()    {return this.#time;     }

  set bib(value)      {this.#bib      = value;}
  set position(value) {this.#position = value;}
  set stage(value)    {this.#stage    = value;}
  set status(value)   {this.#status   = value;}
  set time(value)     {this.#time     = value;}

  update(data){
    if ("bib"       in data){this.#bib      = data.bib;}
    if ("position"  in data){this.#position = data.position;}
    if ("stage"     in data){this.#stage    = data.stage;}
    if ("status"    in data){this.#status   = data.status;}
    if ("time"      in data){this.#time     = data.time;}
  }

}
