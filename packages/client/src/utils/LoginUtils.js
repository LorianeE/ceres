import * as config from '../config.json';
import httpClient from './http/HttpClient';

function getFacebookLoginUrl() {
  return `${config.server.url}/rest/auth/facebook`;
}

async function isUserLoggedIn() {
  const user = await httpClient.get(`/rest/auth/login/success`);
  if (user) {
    return user;
  }
  return null;
}

async function logout() {
  await httpClient.get(`/rest/auth/logout`);
}

export default {
  getFacebookLoginUrl,
  isUserLoggedIn,
  logout,
};
