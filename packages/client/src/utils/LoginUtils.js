import * as config from '../config.json';

const getFacebookLoginUrl = () => {
  return `${config.server.url}/rest/auth/facebook`;
};

export default {
  getFacebookLoginUrl,
};
