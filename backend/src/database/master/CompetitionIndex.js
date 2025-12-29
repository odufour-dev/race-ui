/* src/database/master/CompetitionIndex.js */
import { Model, DataTypes } from 'sequelize';

export class CompetitionIndex extends Model {
  static initialize(sequelize) {
    return this.init({
      name: { type: DataTypes.STRING, allowNull: false },
      dbFileName: { type: DataTypes.STRING, allowNull: false, unique: true },
      date: DataTypes.DATEONLY,
      status: DataTypes.ENUM('active', 'archived', 'planned')
    }, { sequelize, modelName: 'competition_index' });
  }
}