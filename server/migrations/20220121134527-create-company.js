'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull : false,
        unique: true,
        validate:{
          len : [2,25],
          is_string(value){
            if(typeof value !== 'string') throw new ("Name must be a valid string");
          }
        }
      },
      domain: {
        type: Sequelize.STRING,
        len:[2,50]
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,

      },
      timezone: {
        type: Sequelize.STRING
      },
      owner_id: {
        type: Sequelize.INTEGER,
      },
      deleted_at: {
        allowNull: false,
        type: Sequelize.DATE,
        validate:{
          isDate:true
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull:false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }).then(() => queryInterface.addIndex('Companies',['name','deleted_at']))
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Companies');
  }
};