
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/db.js';

export class Racer extends Model {}

Racer.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  team: DataTypes.STRING
}, { sequelize, modelName: 'racer' });
