import { Model, DataTypes } from 'sequelize';

export class Event extends Model {

  static initialize(sequelize){
    return super.init({
        stageId: DataTypes.INTEGER,
        annexId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category: DataTypes.STRING,
        name: DataTypes.STRING,
        values: {
            type: DataTypes.JSON
        },
        distance: DataTypes.INTEGER,
        type: DataTypes.ENUM('points', 'bonification')
    }, { sequelize, modelName: 'event',  tableName: 'event' });
  }

}
