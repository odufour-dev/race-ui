
import { Model, DataTypes } from 'sequelize';

export class Index extends Model {

  static initialize(sequelize) {
    return super.init({
      name:     { type: DataTypes.STRING,  allowNull: false },
      filename: { type: DataTypes.STRING,  allowNull: false, unique: true },
      raceId:   { type: DataTypes.INTEGER, allowNull: false },
      date:       DataTypes.DATEONLY,
      status:     DataTypes.ENUM('active', 'archived', 'planned')
    }, { sequelize, modelName: 'competitions' });
  }

}