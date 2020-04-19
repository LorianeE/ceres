import axios from 'axios';

async function mapBody(response, bodyOnly) {
  if (bodyOnly) {
    return response.data;
  }
  return {
    headers: response.headers,
    body: response.data,
  };
}

const httpClient = {
  async get(url, bodyOnly = true) {
    const response = await axios.get(url);
    return mapBody(response, bodyOnly);
  },

  async post(url, body, bodyOnly = true) {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return mapBody(response, bodyOnly);
  },

  async put(url, body, bodyOnly = true) {
    const response = await axios.put(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return mapBody(response, bodyOnly);
  },

  async delete(url) {
    return axios.delete(url, {
      method: 'DELETE',
    });
  },
};

export default httpClient;
