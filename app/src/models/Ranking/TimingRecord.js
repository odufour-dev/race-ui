
export class TimingRecord {

  constructor(bib, stage, position, time, status) {
    this.bib_       = bib;
    this.stage_     = stage;
    this.position_  = position;
    this.time_      = time;
    this.status_    = status;
  }

  get bib()     {return this.bib_;      }
  get position(){return this.position_; }
  get stage()   {return this.stage_;    }
  get status()  {return this.status_;   }
  get time()    {return this.time_;     }

}
