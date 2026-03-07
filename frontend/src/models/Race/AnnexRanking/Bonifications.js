import AnnexRanking from "./AnnexRanking"

export class Bonifications extends AnnexRanking {

  #categories
  #seconds

  get categories(){return this.#categories; }
  get seconds(){ return this.#seconds; }

  clone(){
    return new Bonifications(this._id,this._type,this._title,this._priority);
  }

  toJSON(){
    const categories = [];
    for (let i = 0; i < this.#categories.length; i++){
      categories.push({name: this.#categories[i], time: this.#seconds[i]})
    }
      return {...super.toJSON(), categories: categories};
    }

  update(settings){

    let data = this.clone();
    data.updateCommon(settings);

    if ("categories" in settings){
      data.#categories = settings.categories;
    }

    if ("options" in settings){
      data.#seconds = settings.options;
    }

    return data;
  }

}