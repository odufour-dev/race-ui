
import { Model, DataTypes } from 'sequelize';

export class Race extends Model {
  
  static initialize(sequelize){
    return super.init({
      name:         DataTypes.STRING,
      description:  { type: DataTypes.STRING, allowNull: true },
      nStages:      DataTypes.INTEGER
    }, { sequelize, modelName: 'race',  tableName: 'race' });
  }

}

