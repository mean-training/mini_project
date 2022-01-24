'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull:false,
        validate:{
          len : [2,25],
          isAlphanumeric:true,
          is_string(value){
            if(typeof value !== 'string') throw new ("Name must be a valid string");
          }
        }
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull:false,
        validate:{
          len : [2,25],
          isAlphanumeric: true,
          is_string(value){
            if(typeof value !== 'string') throw new ("Name must be a valid string");
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true,
        validate:{
          isEmail:true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false,
        validate:{
          len:[8,10],
          is: /^[a-z0-9]+$/i
        }
      },
      company_id : {
        type: Sequelize.INTEGER,
        references: { model: 'Companies', key: 'id' }
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false 
      },
      deleted_at: {
        allowNull: false,
        type: Sequelize.DATE,
        validate:{
          isDate:true
        }
      },
      access_token:{
        type:Sequelize.STRING,
      },
      user_type:{
        type: Sequelize.ENUM,
        values: ['admin','employee'],
        defaultValue: 'employee',
        validate:{
          isIn:[['admin','employee']]
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
    },).then(() => queryInterface.addIndex('Employees' , ['email','is_active']));
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Employees');
  }
};