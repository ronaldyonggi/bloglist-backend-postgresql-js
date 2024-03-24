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

main()