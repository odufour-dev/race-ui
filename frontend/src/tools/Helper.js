
import { Time } from './Time/Time'

export class Helper {

    #time
    #translator

    constructor(
        translator,
        time = new Time(),
    ){
        this.#time = time;
        this.#translator = translator;
    }

    get time()      {return this.#time;}
    get translator(){return this.#translator;}

}