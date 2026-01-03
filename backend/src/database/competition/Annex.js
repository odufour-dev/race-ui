import { Model, DataTypes } from 'sequelize';

export class Annex extends Model {

  static initialize(sequelize){
    return super.init({
      type:   { type: DataTypes.ENUM('points', 'mountain', 'age', 'team'), allowNull: false },
      name:     DataTypes.STRING,
      priority: DataTypes.INTEGER,
      options: {
        type: DataTypes.JSON, // Utilise JSONB si tu es sur PostgreSQL pour de meilleures performances
        allowNull: true,
        defaultValue: {}
      }
    }, { sequelize, modelName: 'annex' });
  }

}
