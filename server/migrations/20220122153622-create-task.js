'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false,
        validate:{
            notNull:true,
            len: [2,100],
        }
      },
      priority: {
        type: Sequelize.ENUM,
        values: ['high','low','medium'],
        validate:{
          isIn : [['high','low','medium']]
        }
      },
      project_id: {
        type: Sequelize.INTEGER,
        references : {
          model:'Projects',
          id: 'id'
        }
        
      },
      company_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'Companies',
          id:'id'
        }
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      due_date: {
        type: Sequelize.DATE,
        validate:{
          isDate:true,
        }
      },
      deleted_at: {
        allowNull: false,
        type: Sequelize.DATE,
        validate:{
          isDate:true
        }
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
    await queryInterface.dropTable('Tasks');
  }
};