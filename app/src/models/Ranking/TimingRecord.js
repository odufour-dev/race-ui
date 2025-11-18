
export class TimingRecord {

  #bib
  #stage
  #position
  #time
  #status

  constructor(bib = 0, stage = 1, position = 999, time = NaN, status = "unknown") {
    this.bib       = bib;
    this.stage     = stage;
    this.position  = position;
    this.time      = time;
    this.status    = status;
  }

  get bib()     {return this.#bib;      }
  get position(){return this.#position; }
  get stage()   {return this.#stage;    }
  get status()  {return this.#status;   }
  get time()    {return this.#time;     }

  set bib(value)      {this.#bib      = Number(value);}
  set position(value) {this.#position = Number(value);}
  set stage(value)    {this.#stage    = Number(value);}
  set status(value)   {this.#status   = value;}
  set time(value)     {this.#time     = typeof value === "string" ? this.#parseHMS(value) : value;}

  toObject(){return {bib: this.#bib, position:this.#position,stage:this.#stage,status:this.#status,time:this.#time};}

  update(data){
    if ("bib"       in data){this.bib      = data.bib;}
    if ("position"  in data){this.position = data.position;}
    if ("stage"     in data){this.stage    = data.stage;}
    if ("status"    in data){this.status   = data.status;}
    if ("time"      in data){this.time     = data.time}
  }

   #parseHMS(input) {
        if (input == null) return null;
        const s = String(input).trim();
        if (!s) return null;
        const parts = s.split(':').map(p => p.trim());
        // allow ss, mm:ss, hh:mm:ss
        if (parts.length === 1) {
            const sec = Number(parts[0]);
            return Number.isFinite(sec) ? Math.floor(sec) : null;
        }
        if (parts.length === 2) {
            const m = Number(parts[0]);
            const sec = Number(parts[1]);
            if (!Number.isFinite(m) || !Number.isFinite(sec)) return null;
            return Math.floor(m * 60 + sec);
        }
        if (parts.length === 3) {
            const h = Number(parts[0]);
            const m = Number(parts[1]);
            const sec = Number(parts[2]);
            if (![h,m,sec].every(Number.isFinite)) return null;
            return Math.floor(h * 3600 + m * 60 + sec);
        }
        return null;
    }

}
