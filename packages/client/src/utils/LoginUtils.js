import * as config from '../config.json';
import httpClient from './http/HttpClient';

function getFacebookLoginUrl() {
  return `${config.server.url}/rest/auth/facebook`;
}

async function isUserLoggedIn() {
  try {
    return await httpClient.get(`/rest/auth/userinfo`);
  } catch (err) {
    if (err.response.status === 401) {
      return null;
    }
    throw err;
  }
}

async function logout() {
  await httpClient.get(`/rest/auth/logout`);
}

export default {
  getFacebookLoginUrl,
  isUserLoggedIn,
  logout,
};
