
export class Registration extends Model {}

Registration.init({
  bib: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'registration' });
