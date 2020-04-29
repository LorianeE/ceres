import httpClient from './http/HttpClient';

function getFacebookLoginUrl() {
  return `${process.env.REACT_APP_BACKEND_URL}/rest/auth/facebook`;
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
