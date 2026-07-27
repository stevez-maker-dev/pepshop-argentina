import dotenv from 'dotenv';

dotenv.config();

const ENVIRONMENT = {
  PORT: process.env.PORT || 3000,
  URL_MONGO: process.env.URL_MONGO,
  JWT_SECRETO: process.env.JWT_SECRETO,
};

export default ENVIRONMENT;