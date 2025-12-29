
import { Model, DataTypes } from 'sequelize';

import { Result } from './Result.js';

export class Race extends Model {
  
  /*
  async getGeneralRanking(currentStageId) {
    // 'this.id' fait référence à l'ID de l'instance de course actuelle
    return await Result.findAll({
      attributes: [
        'bib',
        [fn('SUM', col('time_seconds')), 'totalSeconds'],
        [fn('SUM', col('time_milliseconds')), 'totalMilliseconds'],
        [fn('SUM', col('position')), 'sumPositions'],
        [
          literal(`MAX(CASE WHEN stage_id = ${currentStageId} THEN position ELSE 999 END)`), 
          'lastStagePos'
        ]
      ],
      include: [{
        association: 'stage',
        where: { raceId: this.id },
        attributes: [] 
      }],
      group: ['bib'],
      order: [
        [literal('"totalSeconds"'), 'ASC'],
        [literal('"totalMilliseconds"'), 'ASC'],
        [literal('"sumPositions"'), 'ASC'],
        [literal('"lastStagePos"'), 'ASC']
      ],
      raw: true
    });
  }
    */

  static initialize(sequelize){
    return super.init({
      name:     DataTypes.STRING,
      nStages:  DataTypes.INTEGER
    }, { sequelize, modelName: 'race' });
  }

}

