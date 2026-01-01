import { Model, DataTypes } from 'sequelize';

export class Result extends Model {

    static initialize(sequelize){

        return super.init({
            rank:   { type: DataTypes.INTEGER,  allowNull: true     },
            time:   { type: DataTypes.STRING,   allowNull: true     },
            points: { type: DataTypes.INTEGER,  defaultValue: 0     }
            }, { sequelize, modelName: 'result',  tableName: 'result' }
        );
    }

}
