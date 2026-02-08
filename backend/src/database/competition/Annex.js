import { Model, DataTypes } from 'sequelize';

export class Annex extends Model {

  static initialize(sequelize){
    return super.init({
      type:   { type: DataTypes.ENUM('points', 'mountain', 'filter', 'team', 'bonification'), allowNull: false },
      name:     DataTypes.STRING,
      category: DataTypes.STRING,
      priority: DataTypes.INTEGER,
      options: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      }
    }, { sequelize, modelName: 'annex',  tableName: 'annex' });
  }

}
