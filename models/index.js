const Sequelize = require('sequelize');
const path      = require('path');
const fs        = require('fs');
const rfr       = require('rfr');

const config = rfr('config/db')[process.env.NODE_ENV];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    logging:  false,
    host:     config.host,
    dialect:  config.dialect,
    pool:     {
      max:  5,
      min:  0,
      idle: 10000
    }
  }
);

const db = {
  Sequelize,
  sequelize
};

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

module.exports = db;
