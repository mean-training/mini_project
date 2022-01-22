'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeProjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'Employees',
          id:'id'
        }
      },
      project_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'Projects',
          id:'id'
        }
      },
      deleted_at: {
        type: Sequelize.DATE,
        validate:{
          isDate : true
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employee_projects');
  }
};