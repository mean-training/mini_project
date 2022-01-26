'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskUser.init({
    employee_id: DataTypes.INTEGER,
    task_id: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE,
    assigned_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TaskUser',
  });
  return TaskUser;
};