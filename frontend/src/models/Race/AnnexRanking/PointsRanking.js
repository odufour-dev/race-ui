import AnnexRanking from "./AnnexRanking"

export class PointsRanking extends AnnexRanking {

  #categories
  #points

  get categories(){return this.#categories; }
  get points(){ return this.#points; }

  clone(){
    return new PointsRanking(this._id,this._type,this._title,this._priority);
  }

  toJSON(){
    const categories = [];
    for (let i = 0; i < this.#categories.length; i++){
      categories.push({name: this.#categories[i], points: this.#points[i]})
    }
      return {...super.toJSON(), categories: categories};
    }

  update(settings){

    let data = this.clone();
    data.updateCommon(settings);

    data.#categories  = [];
    data.#points      = [];
    if ("categories" in settings){
      settings.categories.map( (cat) => {
        data.#categories.push(cat.name);
        data.#points.push(cat.points);
      });
    }
    return data;
  }

}