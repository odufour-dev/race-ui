import { Model, DataTypes } from 'sequelize';
import { sequelize } from './database.js';

class Stage extends Model {}

Stage.init({
  number: DataTypes.INTEGER,      // Numéro de l'étape (1, 2, 3...)
  date: DataTypes.DATEONLY,       // Date de l'étape
  startLocation: DataTypes.STRING,
  endLocation: DataTypes.STRING,
  distance: DataTypes.FLOAT,      // Distance en km
  type: DataTypes.ENUM('flat', 'hilly', 'mountain', 'time-trial') 
}, { sequelize, modelName: 'stage' });