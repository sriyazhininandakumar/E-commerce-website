'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    static associate(models) {
      OrderDetails.belongsTo(models.Order, { foreignKey: 'orderId' });
      OrderDetails.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  OrderDetails.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Orders', key: 'id' }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Products', key: 'id' }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pricePerItem: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
    }
  }, {
    sequelize,
    modelName: 'OrderDetails',
    tableName: 'OrderDetails',
    timestamps: true
  });

  return OrderDetails;
};
