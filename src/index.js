const config = require('./utils/config')
const { Sequelize } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(config.DATABASE_URL)

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established!')
    sequelize.close()
  } catch (error) {
    console.log('Unable to connect to DB:', error)
  }
}

class Blog extends Model {}
Model.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})
Blog.sync()
