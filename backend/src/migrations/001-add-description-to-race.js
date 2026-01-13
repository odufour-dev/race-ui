import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
    await queryInterface.addColumn('race', 'description', {
        type: DataTypes.STRING,
        allowNull: true,
    });
}

export async function down({ context: queryInterface }) {
    await queryInterface.removeColumn('race', 'description');
}
