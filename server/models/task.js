'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.Company,{foreignKey:'company_id',as:'companies'});
      Task.belongsTo(models.Project,{foreignKey:'project_id',as:'projects'});
      Task.belongsToMany(models.Employee,{through:'EmployeeTask',foreignKey:'task_id',as: 'employees'})
    }
  }
  Task.init({
    title: DataTypes.STRING,
    priority: DataTypes.STRING,
    project_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    due_date: DataTypes.DATE
  }, {
    timestamps: true,
    underscored:true,
    paranoid: true,
    deletedAt: 'deleted_at',
    sequelize,
    modelName: 'Task',
  });
  return Task;
};