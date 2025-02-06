// db.js


require('dotenv').config();
const { Sequelize } = require('sequelize');

// Create a connection instance
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//     port: process.env.DB_PORT,
//     logging: false,
//   }
// );

const sequelize = new Sequelize(
    process.env.DB_URL,
    {
        dialect: 'postgres',
        logging: false,
        dialectOptions:{
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
  );

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log('Connected to PostgreSQL successfully!'))
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit if connection fails
  });

// Export sequelize instance
module.exports = sequelize;
