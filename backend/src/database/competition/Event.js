import { Model, DataTypes } from 'sequelize';

export class Event extends Model {

  static initialize(sequelize){
    return super.init({
        annexId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        values: {
            type: DataTypes.JSON
        },
        distance: DataTypes.INTEGER,
        type: DataTypes.ENUM('annex', 'bonification')
    }, { sequelize, modelName: 'event',  tableName: 'event' });
  }

}
