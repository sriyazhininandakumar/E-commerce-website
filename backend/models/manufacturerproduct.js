'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ManufacturerProduct extends Model {
    static associate(models) {
      ManufacturerProduct.belongsTo(models.User, { foreignKey: 'manufacturerId' });
      ManufacturerProduct.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  ManufacturerProduct.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    manufacturerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Products', key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'ManufacturerProduct',
    tableName: 'ManufacturerProducts',
    timestamps: true
  });

  return ManufacturerProduct;
};
