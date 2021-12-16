'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"Title" is required.'
        }
      }
    },
    author: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"Author" is required.'
        }
    }
  },
    genre: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.INTEGER,
    } 
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};