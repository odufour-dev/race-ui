import { Model, DataTypes } from 'sequelize';

export class AnnexResult extends Model {

    static initialize(sequelize){

        return super.init({
            rank:   { type: DataTypes.INTEGER,  allowNull: false        },
            bib:    { type: DataTypes.INTEGER,  allowNull: false        },
            stage:  { type: DataTypes.INTEGER,  allowNull: false        },
            annex:  { type: DataTypes.STRING,   allowNull: false        },
            points: { type: DataTypes.INTEGER,  allowNull: false        }
            }, { sequelize, modelName: 'annexresult',  tableName: 'annexresult' }
        );
    }

}
