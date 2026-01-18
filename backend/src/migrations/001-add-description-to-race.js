import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
    // Check if the column already exists
    const table = await queryInterface.describeTable('race').catch(() => null);
    if (table && !table.description) {
        await queryInterface.addColumn('race', 'description', {
            type: DataTypes.STRING,
            allowNull: true,
        });
    }
}

export async function down({ context: queryInterface }) {
    const table = await queryInterface.describeTable('race').catch(() => null);
    if (table && table.description) {
        await queryInterface.removeColumn('race', 'description');
    }
}
