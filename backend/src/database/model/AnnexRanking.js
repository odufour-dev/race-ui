class AnnexRanking extends Model {}

AnnexRanking.init({
  type: {
    type: DataTypes.ENUM('points', 'mountain', 'young', 'team'),
    allowNull: false
  },
  label: DataTypes.STRING // Ex: "Maillot à Pois"
}, { sequelize, modelName: 'annex_ranking' });