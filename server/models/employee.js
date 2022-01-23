'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.belongsTo(models.Company,{foreignKey:'company_id',as:'companies'});
      Employee.hasOne(models.Company,{foreignKey:'owner_id', as: 'company'});
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
    user_type:{
      type: DataTypes.ENUM('admin','employee'),
      defaultValue: 'employee'
    }
  }, {
    timestamps: true,
    underscored:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};