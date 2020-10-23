/* eslint-disable */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const dotenv = require('dotenv');
const path = require('path');

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const targetEnvFile = isDev ? '.dev.env' : '.env';

  dotenv.config({ path: path.resolve(process.cwd(), targetEnvFile) });

  return {
    env: {
      IS_DEV: isDev,
      API_URL: process.env.API_URL,
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/dashboard/keys',
          permanent: true,
        },
      ];
    },
  };
};
