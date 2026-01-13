
import { Model, DataTypes } from 'sequelize';

export class Race extends Model {
  
  static initialize(sequelize){
    return super.init({
      name:         { type: DataTypes.STRING, allowNull: true },
      description:  DataTypes.STRING,
      nStages:      DataTypes.INTEGER
    }, { sequelize, modelName: 'race',  tableName: 'race' });
  }

}

