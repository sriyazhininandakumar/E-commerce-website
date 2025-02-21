const dotenv = require('dotenv');
dotenv.config();


module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: false,
    },
  },
  test: {
    username: "postgres",
    password: "root",
    database: "ecommerce_test", // Test DB
    host: "localhost",
    dialect: "postgres",
    logging: false, // Disable logging for cleaner test output
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres",
    ssl: 'require'
  }
}