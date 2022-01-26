'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeProject.init({
    employee_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE
  }, {
    underscored:true,
    timestamps:true,
    paranoid:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    sequelize,
    modelName: 'EmployeeProject',
    tableName:'EmployeeProjects'
  });
  return EmployeeProject;
};