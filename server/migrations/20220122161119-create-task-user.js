'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeTasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Tasks',
          id:'id'
        }
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Employees',
          id:'id'
        }
      },
      deleted_at: {
        type: Sequelize.DATE,
        validate:{
          isDate:true
        }
      },
      assigned_by: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EmployeeTasks');
  }
};