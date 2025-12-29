import { Model, DataTypes } from 'sequelize';

export class Annex extends Model {

  static initialize(sequelize){
    return super.init({
      type: { type: DataTypes.ENUM('points', 'mountain', 'young', 'team'), allowNull: false },
      label: DataTypes.STRING
    }, { sequelize, modelName: 'annex_ranking' });
  }

}
