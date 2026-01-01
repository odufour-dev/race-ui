
import { Model, DataTypes } from 'sequelize';

export class Registration extends Model {

  static initialize(sequelize){
    return super.init({
      bib: { type: DataTypes.INTEGER, allowNull: true }
    }, { sequelize, modelName: 'registration' });
  }

}


