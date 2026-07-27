import dotenv from 'dotenv';

dotenv.config();

const ENVIRONMENT = {
  PORT: process.env.PORT || 3000,
  URL_MONGO: process.env.URL_MONGO || 'mongodb://localhost:27017/pepshop',
};

export default ENVIRONMENT;