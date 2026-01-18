import { Model, DataTypes } from 'sequelize';

export class StageResult extends Model {

    static initialize(sequelize){

        return super.init({
            rank:   { type: DataTypes.INTEGER,  allowNull: false        },
            bib:    { type: DataTypes.INTEGER,  allowNull: false        },
            stage:  { type: DataTypes.INTEGER,  allowNull: false        }, // Stage number (not the ID)
            status: { type: DataTypes.ENUM('unknown', 'dnf', 'dns', 'done', 'abs', 'none', 'duplicate'), defaultValue: 'unknown' },
            time:   { type: DataTypes.INTEGER,  defaultValue: 0         },
            millis: { type: DataTypes.INTEGER,  defaultValue: 0         }
            }, { sequelize, modelName: 'stageresult',  tableName: 'stageresult' }
        );
    }

}
