'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Company.hasMany(models.Employee,{foreignKey:'company_id', as:'employees'});
      Company.belongsTo(models.Employee,{foreignKey:'owner_id', as:'owner'});
      Company.hasMany(models.Task,{foreignKey:'task_id',as:'tasks'});
    }
  }
  Company.init({
    name: DataTypes.STRING,
    domain: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    timezone: DataTypes.STRING,
    owner_id: DataTypes.INTEGER
  },
  {
    timestamps: true,
    underscored:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    sequelize,
    modelName: 'Company',
  });
  return Company;
};