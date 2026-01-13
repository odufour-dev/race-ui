import { Model, DataTypes } from 'sequelize';

export class Event extends Model {

  static initialize(sequelize){
    return super.init({
      annexId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'annex',
                key: 'id'
            }
        },
        stageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'stage',
                key: 'id'
            }
        },
        points: {
            type: DataTypes.JSON
        },
        distance: DataTypes.INTEGER
    }, { sequelize, modelName: 'event',  tableName: 'event' });
  }

}
