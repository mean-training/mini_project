'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.belongsTo(models.Company,{foreignKey:'company_id',as:'companies'});
      Employee.belongsToMany(models.Task,{through:'EmployeeTask',foreignKey:'employee_id', as :'tasks'});
      Employee.belongsToMany(models.Project,{through:'EmployeeProject',foreignKey:"employee_id",as:'projects'});
    }
  }
  Employee.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    access_token:DataTypes.TEXT,
    user_type:{
      type: DataTypes.ENUM('admin','employee'),
      defaultValue: 'employee'
    }
  }, {
    hooks:{
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    timestamps: true,
    underscored:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'Employees',
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};