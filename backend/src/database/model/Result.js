import { Model, DataTypes } from 'sequelize';

export class Results extends Model {

    formatTime() {
        return `${this.time} (Rank: ${this.rank})`;
    }

    static initialize(sequelize){

        return super.init({
            rank: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            time: {
                type: DataTypes.STRING,
                allowNull: true
            },
            points: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
            }, { 
            sequelize, 
            modelName: 'results',
            tableName: 'results' 
            }
        );
    }

}
