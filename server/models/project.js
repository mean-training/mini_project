'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.hasMany(models.Task,{foreignKey:'project_id',as:"tasks"});
      Project.belongsToMany(models.Employee,{through:'EmployeeProject',foreignKey:"project_id",as:'employees'});
    }
  }
  Project.init({
    project_name: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE
  }, {
    timestamps:true,
    underscored:true,
    paranoid:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    sequelize,
    modelName: 'Project',
  });
  return Project;
};