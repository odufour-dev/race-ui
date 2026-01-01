
import { Model, DataTypes } from 'sequelize';

export class Racer extends Model {

  static initialize(sequelize){
    return super.init({
      firstName:  DataTypes.STRING,
      lastName:   DataTypes.STRING,
      team:       DataTypes.STRING,
      category:   DataTypes.STRING,
      ffcID:      DataTypes.STRING,
      uciID:      DataTypes.STRING,
      sex:        DataTypes.ENUM('men', 'women') 
    }, { sequelize, modelName: 'racer' });
  }

}

