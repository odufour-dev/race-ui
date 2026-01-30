import { Model, DataTypes } from 'sequelize';

export class Event extends Model {

  static initialize(sequelize){
    return super.init({
        stageId: DataTypes.INTEGER,
        annexId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: DataTypes.STRING,
        values: {
            type: DataTypes.JSON
        },
        distance: DataTypes.INTEGER,
        type: DataTypes.ENUM('annex', 'bonification')
    }, { sequelize, modelName: 'event',  tableName: 'event' });
  }

}
