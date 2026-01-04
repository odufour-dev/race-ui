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
        raceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'race',
                key: 'id'
            }
        }
    }, { sequelize, modelName: 'event' });
  }

}
