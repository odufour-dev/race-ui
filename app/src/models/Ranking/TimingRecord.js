
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

}
