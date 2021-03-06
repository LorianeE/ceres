import httpClient from './HttpClient';

function getFacebookLoginUrl() {
  return `/rest/auth/facebook`;
}

async function getUserInfo() {
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
  getUserInfo,
  logout,
};
